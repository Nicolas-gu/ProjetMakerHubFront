import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TokenService } from '../../../core/services/token-service';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private _authService = inject(AuthService)
  public _tokenService = inject(TokenService)

  isLoggedIn = computed(() => !!this._tokenService.token());

  logout(){
    this._authService.logout();
  }
}
