import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../api.config';
import {
  AnnouncementListResponse,
  AnnouncementResponse,
  EventAnnouncement,
} from '../Models/AnnouncementModel';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  // Same backend host as AddEventService
  private readonly apiurl: string = API_BASE + 'api/events';

  constructor(private http: HttpClient) {}

  getAll(opts: { search?: string; status?: string; page?: number; limit?: number }): Promise<AnnouncementListResponse> {
    let params = new HttpParams();
    if (opts.search) params = params.set('search', opts.search);
    if (opts.status) params = params.set('status', opts.status);
    if (opts.page) params = params.set('page', opts.page);
    if (opts.limit) params = params.set('limit', opts.limit);
    return firstValueFrom(this.http.get<AnnouncementListResponse>(this.apiurl, { params }));
  }

  getById(id: string): Promise<AnnouncementResponse> {
    return firstValueFrom(this.http.get<AnnouncementResponse>(this.apiurl + '/' + id));
  }

  create(entity: Partial<EventAnnouncement>): Promise<AnnouncementResponse> {
    return firstValueFrom(this.http.post<AnnouncementResponse>(this.apiurl, entity));
  }

  update(id: string, entity: Partial<EventAnnouncement>): Promise<AnnouncementResponse> {
    return firstValueFrom(this.http.put<AnnouncementResponse>(this.apiurl + '/' + id, entity));
  }

  delete(id: string): Promise<AnnouncementResponse> {
    return firstValueFrom(this.http.delete<AnnouncementResponse>(this.apiurl + '/' + id));
  }
}
