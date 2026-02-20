import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlotType } from '../../../interfaces/Planning.models';
import { parseSlotType } from '../../../shared/slot-type-utils';
import { PlanningService } from '../../../core/services/planning-service';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../core/services/recipe-service';
import { RecipeSearchResponseDto } from '../../../interfaces/recipe.models';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private planningService = inject(PlanningService);
  private recipeService = inject(RecipeService);

  planningMode = false;
  targetDay: string | null = null;
  targetType: SlotType | null = null;
  targetWeekStart: string | null = null;

  defaultPortion = 1;

  loading = signal(false);
  items = signal<RecipeSearchResponseDto[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.planningMode = qp.get('from') === 'planning';
    this.targetDay = qp.get('day');
    this.targetWeekStart = qp.get('weekStart');
    this.targetType = parseSlotType(qp.get('type'));
    console.log('planningMode', this.planningMode);
    console.log('day', this.targetDay, 'weekStart', this.targetWeekStart, 'type', this.targetType);
    console.log('all queryParams', this.route.snapshot.queryParamMap.keys.map(k => [k, this.route.snapshot.queryParamMap.get(k)]));

    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.recipeService.favorites(1, 50).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur chargement favoris');
        this.loading.set(false);
      }
    });
  }

  openRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  addToPlanning(recipeId: string) {
    console.log('addToPlanning click', { recipeId, planningMode: this.planningMode, day: this.targetDay, weekStart: this.targetWeekStart, type: this.targetType });
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
        this.router.navigate(['/home'], { queryParams: { weekStart } });
      }
    });
  }
}