import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu'
import { Planning } from '../../planning/planning/planning';

@Component({
  selector: 'app-home',
  imports: [ MatMenuModule, Planning],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private router: Router) {}

  // Routing
  goToRecipeSearch(){
    this.router.navigateByUrl("")
  }
  goToRecipeProposal(){
    this.router.navigateByUrl("")
  }
  goToRecipeAdd(){
    this.router.navigateByUrl("/recipe-add")
  }
  
}
