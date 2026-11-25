import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Blocks admin pages until the admin has signed in. */
export const adminGuard: CanActivateFn = (_route, state) => {
  // The server has no browser storage; the browser re-runs this guard after hydration.
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) {
    return true;
  }
  return inject(Router).createUrlTree(['/AdminLogin'], { queryParams: { returnUrl: state.url } });
};
