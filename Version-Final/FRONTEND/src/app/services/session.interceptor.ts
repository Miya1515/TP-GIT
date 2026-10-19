import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Les opérations d'administration exigent un JWT ADMIN valide (24 h).
 * Si le backend répond 401/403 alors qu'un token est enregistré (session expirée ou rôle insuffisant),
 * la session locale est effacée et l'utilisateur est renvoyé vers la page de connexion.
 */
export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError(err => {
      if (
        err instanceof HttpErrorResponse &&
        (err.status === 401 || err.status === 403) &&
        !req.url.includes('/auth/') &&
        localStorage.getItem('token')
      ) {
        auth.clearSession();
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    })
  );
};
