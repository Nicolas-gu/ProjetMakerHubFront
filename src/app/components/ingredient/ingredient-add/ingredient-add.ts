import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredient-add',
  imports: [MatIconModule],
  templateUrl: './ingredient-add.html',
  styleUrl: './ingredient-add.css',
})
export class IngredientAdd {

  constructor(private router: Router) {}

  
  goBack(){
    this.router.navigateByUrl("/ingredient-list")
  }

}
