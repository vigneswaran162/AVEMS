export type AnnouncementStatus = 'Upcoming' | 'Active' | 'Ended' | 'Cancelled';

export interface EventAnnouncement {
  _id?: string;
  eventName: string;
  comment: string;
  description: string;
  eventStatus: AnnouncementStatus;
  eventPoster?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AnnouncementListResponse {
  success: boolean;
  message: string;
  data: EventAnnouncement[];
  pagination: Pagination;
}

export interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: EventAnnouncement;
}

export const ANNOUNCEMENT_STATUSES: { value: AnnouncementStatus; label: string }[] = [
  { value: 'Upcoming', label: 'Event Upcoming' },
  { value: 'Active', label: 'Event Active' },
  { value: 'Ended', label: 'Event Post Ended' },
  { value: 'Cancelled', label: 'Event Cancelled' },
];
