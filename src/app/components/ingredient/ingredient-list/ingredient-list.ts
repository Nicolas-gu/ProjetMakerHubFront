import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredient-list',
  imports: [MatIconModule],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.css',
})
export class IngredientList {

  constructor(private router: Router) {}

  goToIngredientAdd(){
    this.router.navigateByUrl("/ingredient-add")
  }
  goBack(){
    this.router.navigateByUrl("/ingredient-list")
  }

}
