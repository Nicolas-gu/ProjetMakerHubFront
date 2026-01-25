import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatIconModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private router: Router) {}

  goTOHome(){
    this.router.navigateByUrl("/home")
  }
  goToIngredients(){
    this.router.navigateByUrl("/ingredient-list")
  }
  goToFavoris(){
    this.router.navigateByUrl("/favorite")
  }

}
