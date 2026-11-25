import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardData, EventOpsService } from '../../Services/event-ops.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly palette = ['#0b4f8a', '#2a9bbf', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#64748b'];

  data: DashboardData | null = null;
  isLoading = false;
  loadError = '';

  constructor(private ops: EventOpsService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.isLoading = true;
    this.loadError = '';
    try {
      const res = await this.ops.getDashboard();
      this.data = res.data;
    } catch (err: any) {
      // A 401 is handled globally (redirect to login)
      this.loadError = err?.error?.message || 'Could not load the dashboard';
    } finally {
      this.isLoading = false;
    }
  }

  get attendanceRate(): number {
    const t = this.data?.totals;
    return t && t.registrations > 0 ? Math.round((t.checkedIn / t.registrations) * 100) : 0;
  }

  /** Bar width (%) relative to the busiest event. */
  barWidth(count: number): number {
    const max = Math.max(1, ...(this.data?.perEvent || []).map(e => e.registered));
    return Math.round((count / max) * 100);
  }

  color(i: number): string {
    return this.palette[i % this.palette.length];
  }

  get totalDeptCount(): number {
    return (this.data?.departments || []).reduce((s, d) => s + d.count, 0);
  }

  percent(count: number): number {
    const t = this.totalDeptCount;
    return t ? Math.round((count / t) * 100) : 0;
  }

  /** conic-gradient for the department donut. */
  get donut(): string {
    const total = this.totalDeptCount;
    if (!total) { return 'conic-gradient(#e3e8f0 0 100%)'; }
    let start = 0;
    const stops = (this.data?.departments || []).map((d, i) => {
      const end = start + (d.count / total) * 100;
      const stop = `${this.color(i)} ${start}% ${end}%`;
      start = end;
      return stop;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

  closesText(days: number | null): string {
    if (days === null) { return 'No deadline'; }
    if (days === 0) { return 'Closes today'; }
    return `Closes in ${days} day${days === 1 ? '' : 's'}`;
  }

  openCheckIn(eventNo: string) {
    this.router.navigate(['/CheckIn'], { queryParams: { event: eventNo } });
  }
}
