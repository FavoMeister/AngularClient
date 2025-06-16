import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from './services/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Excluye la ruta de logout del manejo de errores para evitar bucle
  if (req.url.includes('/logout')) {
    return next(req);
  }

  const token = authService.getToken();

  const authReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
  /*if (token) {
    // Clonamos la request para añadir el header de autorización
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si no hay token, pasamos la request sin modificar
  return next(req);*/
};
