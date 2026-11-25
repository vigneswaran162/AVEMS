import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Adds the admin token to requests sent to our backend, and sends the user
 * back to the login page when the backend says the session is no longer valid.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApi = req.url.startsWith(this.auth.apiOrigin);
    const token = this.auth.token;
    if (isApi && token) {
      req = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
    }
    return next.handle(req).pipe(
      tap({
        error: (err: unknown) => {
          if (
            isApi &&
            err instanceof HttpErrorResponse &&
            err.status === 401 &&
            !req.url.endsWith('/api/admin/login')
          ) {
            this.auth.logout(false);
            this.router.navigate(['/AdminLogin'], { queryParams: { returnUrl: this.router.url } });
          }
        },
      })
    );
  }
}
