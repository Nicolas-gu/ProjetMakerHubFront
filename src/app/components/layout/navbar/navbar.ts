import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  private authService = inject(AuthService)
  public tokenService = inject(TokenService)
  private route = inject(Router)

  isLoggedIn = computed(() => !!this.tokenService.token());

  logout(){
    this.authService.logout();
  }

  goShoppingList() {
  this.route.navigate(['/shopping-list']);
}
}
