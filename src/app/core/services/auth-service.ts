import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequestDto } from '../../interfaces/login-request-dto';
import { LoginResponseDto } from '../../interfaces/login-response-dto';
import { TokenService } from './token-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _http = inject(HttpClient)
   private _token = inject(TokenService);
  private _router = inject(Router);

  login(dto: LoginRequestDto): Observable<LoginResponseDto>{
    return this._http.post<LoginResponseDto>(`${environment.apiBaseUrl}/auth/login`, dto);
  }

  logout(redirectTo = '/login'): void {
    this._token.clear();
    this._router.navigateByUrl(redirectTo);
  }
}
