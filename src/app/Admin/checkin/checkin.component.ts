import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Attendee, AttendanceStats, CheckInEvent, EventOpsService } from '../../Services/event-ops.service';
import { ToastNofificationService } from '../../Services/toast-nofification.service';

type Filter = 'all' | 'present' | 'absent';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})
export class CheckinComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoRef?: ElementRef<HTMLVideoElement>;

  events: CheckInEvent[] = [];
  eventNo = '';
  attendees: Attendee[] = [];
  stats: AttendanceStats = { registered: 0, checkedIn: 0, remaining: 0 };

  code = '';
  search = '';
  filter: Filter = 'all';

  loadingEvents = false;
  loadingList = false;
  loadError = '';
  marking = false;

  result: { type: 'ok' | 'already' | 'error'; text: string; name?: string } | null = null;

  // Camera scanning (uses the browser's built-in QR detector when available)
  scannerSupported = false;
  scanning = false;
  private stream?: MediaStream;
  private scanTimer: any;
  private lastScan = { value: '', at: 0 };

  constructor(
    private ops: EventOpsService,
    private route: ActivatedRoute,
    private toast: ToastNofificationService
  ) {}

  async ngOnInit() {
    this.scannerSupported =
      typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia;
    await this.loadEvents();
    const preselect = this.route.snapshot.queryParamMap.get('event');
    if (preselect && this.events.some(e => e.EventNo === preselect)) {
      this.eventNo = preselect;
      await this.loadAttendees();
    }
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

  private errorText(err: any): string {
    return err?.error?.message || err?.message || 'Something went wrong';
  }

  // ---------- data ----------
  async loadEvents() {
    this.loadingEvents = true;
    try {
      this.events = (await this.ops.getCheckInEvents()).data;
    } catch (err: any) {
      this.loadError = this.errorText(err);
    } finally {
      this.loadingEvents = false;
    }
  }

  async onEventChange() {
    this.stopScan();
    this.result = null;
    this.search = '';
    this.filter = 'all';
    this.code = '';
    this.attendees = [];
    if (this.eventNo) { await this.loadAttendees(); }
  }

  async loadAttendees() {
    this.loadingList = true;
    this.loadError = '';
    try {
      const res = await this.ops.getAttendees(this.eventNo);
      this.attendees = res.data;
      this.stats = res.stats;
    } catch (err: any) {
      this.attendees = [];
      this.loadError = this.errorText(err);
    } finally {
      this.loadingList = false;
    }
  }

  private recount() {
    const checkedIn = this.attendees.filter(a => a.CheckedIn).length;
    this.stats = { registered: this.attendees.length, checkedIn, remaining: this.attendees.length - checkedIn };
    const ev = this.events.find(e => e.EventNo === this.eventNo);
    if (ev) { ev.checkedIn = checkedIn; ev.registered = this.attendees.length; }
  }

  private upsert(a: Attendee) {
    const i = this.attendees.findIndex(x => x._id === a._id);
    if (i >= 0) { this.attendees[i] = a; }
    this.recount();
  }

  // ---------- check-in ----------
  get progress(): number {
    return this.stats.registered ? Math.round((this.stats.checkedIn / this.stats.registered) * 100) : 0;
  }

  get filtered(): Attendee[] {
    const q = this.search.trim().toLowerCase();
    return this.attendees.filter(a => {
      if (this.filter === 'present' && !a.CheckedIn) { return false; }
      if (this.filter === 'absent' && a.CheckedIn) { return false; }
      if (!q) { return true; }
      return [a.FullName, a.RollNo, a.RegisterationID, a.PhoneNo, a.Department, a.EmailAddress]
        .some(v => (v || '').toLowerCase().includes(q));
    });
  }

  async submitCode() {
    const value = this.code.trim();
    if (!value || !this.eventNo) { return; }
    await this.mark(value);
    this.code = '';
  }

  /** Mark a ticket present. `code` may be a QR payload, registration id, roll no, phone or email. */
  async mark(code: string) {
    if (this.marking) { return; }
    this.marking = true;
    try {
      const res = await this.ops.markPresent(this.eventNo, code);
      this.upsert(res.data);
      this.result = res.status === 'already'
        ? { type: 'already', text: 'Already checked in', name: res.data.FullName }
        : { type: 'ok', text: 'Checked in', name: res.data.FullName };
    } catch (err: any) {
      this.result = { type: 'error', text: this.errorText(err) };
    } finally {
      this.marking = false;
    }
  }

  checkIn(a: Attendee) {
    return this.mark(a.RegisterationID || a.RollNo);
  }

  async undo(a: Attendee) {
    try {
      const res = await this.ops.undoCheckIn(this.eventNo, a._id);
      this.upsert(res.data);
      this.toast.showInfo('Check-in removed for ' + a.FullName, '');
    } catch (err: any) {
      this.toast.showError(this.errorText(err), '');
    }
  }

  // ---------- camera ----------
  async startScan() {
    if (!this.eventNo || this.scanning) { return; }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.scanning = true;
      // wait for the <video> element to be rendered
      setTimeout(async () => {
        const video = this.videoRef?.nativeElement;
        if (!video || !this.stream) { return; }
        video.srcObject = this.stream;
        await video.play().catch(() => undefined);
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        this.scanTimer = setInterval(async () => {
          try {
            const codes = await detector.detect(video);
            if (codes.length) { this.onScanned(codes[0].rawValue); }
          } catch { /* frame not ready */ }
        }, 400);
      }, 0);
    } catch {
      this.toast.showError('Camera is not available. Allow camera access, or type the ticket instead.', '');
      this.stopScan();
    }
  }

  private onScanned(value: string) {
    const now = Date.now();
    // Ignore the same code for 4 seconds so one ticket is not submitted repeatedly
    if (value === this.lastScan.value && now - this.lastScan.at < 4000) { return; }
    this.lastScan = { value, at: now };
    this.mark(value);
  }

  stopScan() {
    clearInterval(this.scanTimer);
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = undefined;
    this.scanning = false;
  }
}
