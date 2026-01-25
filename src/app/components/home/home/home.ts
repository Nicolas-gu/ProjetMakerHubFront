import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'
import { PlanningDay } from '../../planning/planning-day/planning-day';

@Component({
  selector: 'app-home',
  imports: [MatIcon, MatMenuModule, PlanningDay],
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
