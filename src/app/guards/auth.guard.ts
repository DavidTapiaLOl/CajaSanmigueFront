import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si está autenticado (tiene token), lo dejamos pasar
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no, lo mandamos al login
  router.navigate(['/login']);
  return false;
};