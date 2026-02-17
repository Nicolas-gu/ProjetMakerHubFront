import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "../services/token-service";

export const authGuard: CanActivateFn = () => {
    const _tokenService = inject(TokenService);
    const _router = inject(Router);

    if(_tokenService.isLoggedIn()) return true;

    return _router.createUrlTree(['/login'])
}