import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Protège la route /admin.
 * - pas de token            → page de connexion (comme admin.js d'origine)
 * - connecté mais pas ADMIN → retour à la boutique (le backend refuse de toute façon ces opérations)
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!localStorage.getItem('token')) {
    return router.parseUrl('/login');
  }
  if (localStorage.getItem('role') !== 'ADMIN') {
    return router.parseUrl('/');
  }
  return true;
};
