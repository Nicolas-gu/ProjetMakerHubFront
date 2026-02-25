import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TokenService } from '../../../core/services/token-service';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private authService = inject(AuthService)
  public tokenService = inject(TokenService)
  public stateService = inject(StateService)
  private route = inject(Router)

  isLoggedIn = computed(() => !!this.tokenService.token());

  links = [{
    title: 'Liste de courses',
    handler: () => this.goShoppingList(),
  },
  {
    title: 'Recettes favorites',
    href: 'recipe/favorite',
  },
  {
    title: 'Ingrédients à la maison',
    href: 'pantry',
  },
  {
    title: 'Chercher une recette',
    href: 'recipe/search',
  },
  {
    title: 'Déconnexion',
    handler: () => this.logout(),
  },
];

  logout(){
    this.stateService.setIsPanningMode(false);
    this.authService.logout();
  }

  goShoppingList() {
    this.stateService.setIsPanningMode(false);
    this.route.navigate(['/shopping-list']);
  }
}
