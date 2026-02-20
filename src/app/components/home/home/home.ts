import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu'
import { Planning } from '../../planning/planning/planning';
import { ShoppingListService } from '../../../core/services/shopping-list-service';
import { toIsoDate, weekStartMonday } from '../../../shared/date-utils';

@Component({
  selector: 'app-home',
  imports: [ MatMenuModule, Planning],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private router = inject(Router);
  private shoppingListService = inject(ShoppingListService);

  generating = false;
  currentWeekStart: Date = weekStartMonday(new Date());

  generateShoppingList() {
    if (this.generating) return;
    this.generating = true;

    const ws = weekStartMonday(new Date());
    const iso = toIsoDate(ws);

    this.shoppingListService.generate(iso).subscribe({
      next: (dto) => {
        this.generating = false;
        if (!dto?.weekStart) {
          this.router.navigate(['/shopping-list'], { queryParams: { weekStart: iso } });
          return;
        }
        this.router.navigate(['/shopping-list'], { queryParams: { weekStart: dto.weekStart } });
      },
      error: () => {
        this.generating = false;
      }
    });
  }

  goToRecipeAdd() {
    this.router.navigate(['/recipes/add']);
  }

  goToPantry() {
    this.router.navigate(['/pantry']);
  }
}

