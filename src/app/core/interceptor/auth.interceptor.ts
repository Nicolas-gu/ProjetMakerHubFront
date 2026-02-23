import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token-service';

// Intercepte les requetes Http (req)
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Dépendances
  const tokenService = inject(TokenService);

  const token = tokenService.token();

  if (!token) return next(req);

  // clone la requete et ajoute le token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  // renvoie la copie modifiee
  return next(authReq);

  //TODO ignorer login/register
  //TODO refresh token

};

