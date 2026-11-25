import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Availability {
  EventNo: string;
  seatLimit: number | null;
  registered: number;
  seatsLeft: number | null;
  isFull: boolean;
  deadline: string | null;
  deadlinePassed: boolean;
  closesInDays: number | null;
  isOpen: boolean;
  reason: string;
}

export interface Attendee {
  _id: string;
  RegisterationID: string;
  RollNo: string;
  FullName: string;
  Department: string;
  CollegeName: string;
  PhoneNo: string;
  EmailAddress: string;
  CheckedIn?: boolean;
  CheckedInAt?: string;
}

export interface CheckInEvent {
  EventNo: string;
  EventTitle: string;
  EventDate: string;
  Type: string;
  registered: number;
  checkedIn: number;
}

export interface AttendanceStats {
  registered: number;
  checkedIn: number;
  remaining: number;
}

export interface DashboardData {
  totals: { events: number; upcoming: number; current: number; closed: number; registrations: number; checkedIn: number };
  perEvent: { EventNo: string; EventTitle: string; EventDate: string; Type: string; seatLimit: number | null; registered: number; checkedIn: number }[];
  departments: { department: string; count: number }[];
  upcomingEvents: {
    EventNo: string; EventTitle: string; EventDate: string; EventPlace: string;
    registered: number; seatLimit: number | null; seatsLeft: number | null; closesInDays: number | null; isOpen: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class EventOpsService {
  private readonly base: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  // Public
  async getAvailability(eventNo: string): Promise<Availability | null> {
    const res: any = await firstValueFrom(this.http.get(this.base + 'availability/' + encodeURIComponent(eventNo)));
    return res?.success ? res.data : null;
  }

  // Admin (token is added by AuthInterceptor)
  getDashboard(): Promise<{ success: boolean; data: DashboardData }> {
    return firstValueFrom(this.http.get<any>(this.base + 'dashboard'));
  }

  getCheckInEvents(): Promise<{ success: boolean; data: CheckInEvent[] }> {
    return firstValueFrom(this.http.get<any>(this.base + 'checkin/events'));
  }

  getAttendees(eventNo: string): Promise<{ success: boolean; data: Attendee[]; event: any; stats: AttendanceStats }> {
    return firstValueFrom(this.http.get<any>(this.base + 'checkin/' + encodeURIComponent(eventNo)));
  }

  markPresent(eventNo: string, code: string): Promise<{ success: boolean; status: 'checked_in' | 'already'; message: string; data: Attendee }> {
    return firstValueFrom(this.http.post<any>(this.base + 'checkin/' + encodeURIComponent(eventNo) + '/mark', { code }));
  }

  undoCheckIn(eventNo: string, id: string): Promise<{ success: boolean; data: Attendee }> {
    return firstValueFrom(this.http.post<any>(this.base + 'checkin/' + encodeURIComponent(eventNo) + '/undo', { id }));
  }
}
