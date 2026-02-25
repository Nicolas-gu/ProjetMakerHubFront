import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlotType } from '../../../interfaces/Planning.models';
import { parseSlotType } from '../../../shared/slot-type-utils';
import { PlanningService } from '../../../core/services/planning-service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../../core/services/recipe-service';
import { RecipeSearchResponseDto } from '../../../interfaces/recipe.models';
import { MatIconModule } from '@angular/material/icon';
import { StateService } from '../../../core/services/state-service';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './recipe-search.html',
  styleUrl: './recipe-search.css',
})
export class RecipeSearch implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private planningService = inject(PlanningService);
  private recipeService = inject(RecipeService);
  private stateService = inject(StateService);
  private location = inject(Location)

  planningMode = this.stateService.isPanningMode;
  targetDay: string | null = null;
  targetType: SlotType | null = null;
  targetWeekStart: string | null = null;

  defaultPortion = 1;

  q = signal('');
  loading = signal(false);
  results = signal<RecipeSearchResponseDto[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.targetDay = qp.get('day');
    this.targetWeekStart = qp.get('weekStart');
    this.targetType = parseSlotType(qp.get('type'));

    this.search();
  }

  search() {
    this.loading.set(true);
    this.error.set(null);

    this.recipeService.search({
      q: this.q().trim(),
      page: 1,
      pageSize: 20
    }).subscribe({
      next: (res) => {
        this.results.set(res.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur recherche recettes');
        this.loading.set(false);
      }
    });
  }

  openRecipe(id: string) {
    if (this.planningMode()) {
      this.router.navigate(['/recipe', id], {
        queryParams: {
          day: this.targetDay,
          type: this.targetType,          
          weekStart: this.targetWeekStart 
        }
      });
    } else {
      this.router.navigate(['/recipe', id]);
    }
  }

  addToPlanning(recipeId: string) {
    if (!this.planningMode) return;

    const day = this.targetDay;
    const weekStart = this.targetWeekStart;
    const type = this.targetType;

    if (!day || !weekStart || !type) return;

    this.planningService.upsertSlot(weekStart, {
      date: day,
      type: type,
      recipeId: recipeId,
      portion: this.defaultPortion,
    }).subscribe({
      next: () => {
        this.router.navigate(['/home'], { queryParams: { weekStart, day } });
      }
    });
  }

  goBack() {
    this.location.back();
  }
}