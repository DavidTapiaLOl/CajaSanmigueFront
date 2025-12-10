import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 // 1. Inyectamos el identificador de la plataforma
  const platformId = inject(PLATFORM_ID);

  // 2. Verificamos: ¿Estamos en el navegador?
  if (isPlatformBrowser(platformId)) {
    
    // SÍ estamos en el navegador, podemos usar localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedReq);
    }
  }

  // 3. Si estamos en el Servidor (SSR) o no hay token, pasamos la petición limpia
  return next(req);
};