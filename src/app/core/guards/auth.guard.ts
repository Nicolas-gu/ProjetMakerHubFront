import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "../services/token-service";

// S'execute si navigation vers une route protégée canActivate: [authGuard]
export const authGuard: CanActivateFn = () => {

    // Dépendances
    const tokenService = inject(TokenService);
    const router = inject(Router);

    // SI connecté => true
    if (tokenService.isLoggedIn()) return true;
    // Sinon redirige /login
    return router.createUrlTree(['/login'])
}