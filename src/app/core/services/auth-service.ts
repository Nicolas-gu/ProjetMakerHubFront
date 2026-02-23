import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token-service';
import { Router } from '@angular/router';
import { AuthTokenResponse, LoginRequestDto, LoginResponseDto, RegisterRequest } from '../../interfaces/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Dépendances
  private http = inject(HttpClient)
  private token = inject(TokenService);
  private router = inject(Router);
  
  private api = environment.apiBaseUrl;

  // Envoie formulaire recupere token
  register(dto: RegisterRequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.api}/Auth/register`, dto);
  }

  // Envoie formulaire recupere token + tap(stocke)
  login(dto: LoginRequestDto): Observable<LoginResponseDto>{
    return this.http.post<LoginResponseDto>(`${this.api}/auth/login`, dto)
    .pipe(tap(res => this.token.set(res.token)));
  }

  // Supprime le token et redirige
  logout(): void {
    this.token.clear();
    this.router.navigateByUrl('/login');
  }
}
