import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'account',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'callback',
    loadComponent: () => import('./callback/callback.component').then(m => m.CallbackComponent)
  }
];
