import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);

  await authService.initializeAuth();

  if (authService.hasValidToken()) {
    return true;
  }

  sessionStorage.setItem('redirectUrl', state.url);
  authService.login();

  return false;
};
