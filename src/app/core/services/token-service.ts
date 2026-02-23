import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly token = this._token.asReadonly();

  // Stock le token ds localStorage
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }

  // Supprime le token
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }

  // Token => connected
  isLoggedIn(): boolean {
    return !!this.token();
  }

  // Parse le payload du token
  private decodePayload(): any | null {
    const t = this.token();
    if (!t) return null;

    try {
      const payload = t.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  // Lit les CLaims de l'objet
  getUserId(): string | null {
    const p = this.decodePayload();
    return p?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
  }
  getRole(): string | null {
    const p = this.decodePayload();
    return p?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
  }

  // Check si admin
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
}