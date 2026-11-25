import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from '../../Services/announcement.service';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import {
  ANNOUNCEMENT_STATUSES,
  AnnouncementStatus,
  EventAnnouncement,
  Pagination,
} from '../../Models/AnnouncementModel';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent implements OnInit, OnDestroy {
  readonly Math = Math;
  readonly statuses = ANNOUNCEMENT_STATUSES;
  readonly pageSizes = [5, 10, 20];

  items: EventAnnouncement[] = [];
  pagination: Pagination = { total: 0, page: 1, limit: 10, pages: 1 };

  search = '';
  statusFilter = '';

  isLoading = false;
  loadError = '';
  saving = false;
  deleting = false;

  form: FormGroup;
  editingId: string | null = null;
  selected: EventAnnouncement | null = null;   // record shown in the view / delete dialogs

  private searchTimer: any;
  private requestSeq = 0;

  constructor(
    private fb: FormBuilder,
    private service: AnnouncementService,
    private toast: ToastNofificationService
  ) {
    this.form = this.fb.group({
      eventName: ['', [Validators.required, Validators.maxLength(200)]],
      comment: ['', [Validators.maxLength(500)]],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      eventStatus: ['', [Validators.required]],
      eventPoster: [''],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
  }

  // ---------- helpers ----------
  statusLabel(value: string): string {
    return this.statuses.find(s => s.value === value)?.label ?? value;
  }

  hasFilters(): boolean {
    return !!(this.search.trim() || this.statusFilter);
  }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  private modal(id: string, action: 'show' | 'hide') {
    const el = document.getElementById(id);
    const bs = (window as any).bootstrap;
    if (el && bs) {
      const inst = bs.Modal.getOrCreateInstance(el);
      if (action === 'show') { inst.show(); } else { inst.hide(); }
    }
  }

  private errorMessage(err: any): string {
    return err?.error?.message || err?.message || 'Something went wrong';
  }

  // ---------- list ----------
  async load() {
    const seq = ++this.requestSeq;        // ignore out-of-order responses
    this.isLoading = true;
    this.loadError = '';
    try {
      const res = await this.service.getAll({
        search: this.search.trim(),
        status: this.statusFilter,
        page: this.pagination.page,
        limit: this.pagination.limit,
      });
      if (seq !== this.requestSeq) return;
      this.items = res.data;
      this.pagination = res.pagination;
      // The current page no longer exists (e.g. the last row on the last page was deleted)
      if (this.items.length === 0 && this.pagination.total > 0 && this.pagination.page > this.pagination.pages) {
        this.pagination.page = this.pagination.pages;
        await this.load();
        return;
      }
    } catch (err: any) {
      if (seq !== this.requestSeq) return;
      this.items = [];
      this.loadError = this.errorMessage(err);
    }
    if (seq === this.requestSeq) this.isLoading = false;
  }

  onSearchInput() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 350);
  }

  applyFilters() {
    this.pagination.page = 1;
    this.load();
  }

  clearFilters() {
    this.search = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.pages || page === this.pagination.page) return;
    this.pagination.page = page;
    this.load();
  }

  onPageSizeChange() {
    this.pagination.page = 1;
    this.load();
  }

  // ---------- add / edit ----------
  private defaults() {
    return { eventName: '', comment: '', description: '', eventStatus: 'Upcoming', eventPoster: '' };
  }

  openAdd() {
    this.editingId = null;
    this.form.reset(this.defaults());
    this.posterInputReset();
    this.modal('announcementFormModal', 'show');
  }

  openEdit(row: EventAnnouncement) {
    this.editingId = row._id!;
    this.form.reset({
      eventName: row.eventName,
      comment: row.comment,
      description: row.description,
      eventStatus: row.eventStatus,
      eventPoster: row.eventPoster || '',
    });
    this.posterInputReset();
    this.modal('announcementFormModal', 'show');
  }

  resetForm() {
    const row = this.items.find(i => i._id === this.editingId);
    if (this.editingId && row) {
      this.form.reset({
        eventName: row.eventName,
        comment: row.comment,
        description: row.description,
        eventStatus: row.eventStatus,
        eventPoster: row.eventPoster || '',
      });
    } else {
      this.form.reset(this.defaults());
    }
  }

  async save() {
    if (this.saving) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.form.value;
    const payload = {
      eventName: value.eventName.trim(),
      comment: (value.comment || '').trim(),
      description: value.description.trim(),
      eventStatus: value.eventStatus as AnnouncementStatus,
      eventPoster: value.eventPoster || '',
    };
    try {
      if (this.editingId) {
        await this.service.update(this.editingId, payload);
        this.toast.showSuccess('Event announcement updated successfully', '');
      } else {
        await this.service.create(payload);
        this.toast.showSuccess('Event announcement created successfully', '');
        this.pagination.page = 1;
      }
      this.modal('announcementFormModal', 'hide');
      await this.load();
    } catch (err: any) {
      this.toast.showError(this.errorMessage(err), '');
    } finally {
      this.saving = false;
    }
  }

  // ---------- poster ----------
  posterError = '';

  get poster(): string {
    return this.form.get('eventPoster')?.value || '';
  }

  private posterInputReset() {
    this.posterError = '';
    const el = document.getElementById('f-poster') as HTMLInputElement | null;
    if (el) { el.value = ''; }
  }

  removePoster() {
    this.form.patchValue({ eventPoster: '' });
    this.posterInputReset();
  }

  onPosterSelected(event: any) {
    const file: File | undefined = event.target.files && event.target.files[0];
    this.posterError = '';
    if (!file) { return; }
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) {
      this.posterError = 'Please choose a PNG, JPG, WEBP or GIF image.';
      event.target.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      this.posterError = 'Image is too large. Please choose one under 8 MB.';
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Downscale so the stored poster stays small (max 1000px, JPEG)
        const max = 1000;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) { this.posterError = 'Could not process the image.'; return; }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.form.patchValue({ eventPoster: canvas.toDataURL('image/jpeg', 0.82) });
        this.form.get('eventPoster')?.markAsDirty();
      };
      img.onerror = () => { this.posterError = 'That file is not a valid image.'; };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ---------- view ----------
  async openView(row: EventAnnouncement) {
    this.selected = row;
    this.modal('announcementViewModal', 'show');
    try {
      // Refresh from the server so the dialog shows the latest saved values
      const res = await this.service.getById(row._id!);
      this.selected = res.data;
    } catch {
      /* keep the row that is already shown */
    }
  }

  editFromView() {
    const row = this.selected;
    this.modal('announcementViewModal', 'hide');
    if (row) { setTimeout(() => this.openEdit(row), 250); }
  }

  // ---------- delete ----------
  confirmDelete(row: EventAnnouncement) {
    this.selected = row;
    this.modal('announcementDeleteModal', 'show');
  }

  async deleteConfirmed() {
    if (this.deleting || !this.selected?._id) return;
    this.deleting = true;
    try {
      await this.service.delete(this.selected._id);
      this.toast.showSuccess('Event announcement deleted successfully', '');
      this.modal('announcementDeleteModal', 'hide');
      await this.load();
    } catch (err: any) {
      this.toast.showError(this.errorMessage(err), '');
    } finally {
      this.deleting = false;
    }
  }
}
