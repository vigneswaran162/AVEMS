import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../api.config';

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: { token: string; username: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend host (same as the other services)
  readonly apiOrigin: string = API_BASE;
  private readonly loginUrl: string = this.apiOrigin + 'api/admin/login';
  private readonly TOKEN_KEY = 'avems_admin_token';
  private readonly USER_KEY = 'avems_admin_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private get storage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try { return window.localStorage; } catch { return null; }
  }

  get token(): string | null {
    return this.storage?.getItem(this.TOKEN_KEY) ?? null;
  }

  get username(): string {
    return this.storage?.getItem(this.USER_KEY) ?? '';
  }

  /** True when a token exists and has not expired. */
  isLoggedIn(): boolean {
    const t = this.token;
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.clear();
        return false;
      }
      return true;
    } catch {
      this.clear();
      return false;
    }
  }

  async login(username: string, password: string): Promise<AdminLoginResponse> {
    const res = await firstValueFrom(
      this.http.post<AdminLoginResponse>(this.loginUrl, { username, password })
    );
    if (res.success && res.data) {
      this.storage?.setItem(this.TOKEN_KEY, res.data.token);
      this.storage?.setItem(this.USER_KEY, res.data.username);
    }
    return res;
  }

  private clear() {
    this.storage?.removeItem(this.TOKEN_KEY);
    this.storage?.removeItem(this.USER_KEY);
  }

  logout(redirect: boolean = true) {
    this.clear();
    if (redirect) {
      this.router.navigate(['/AdminLogin']);
    }
  }
}
