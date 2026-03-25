import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the reactive Signal to check if they have tokens securely
  if (authService.isAuthenticated()) {
    // Already logged in! Redirect them out of the guest pages
    router.navigate(['/dashboard']);
    return false;
  }

  // Let them pass into the login/registration room
  return true;
};
