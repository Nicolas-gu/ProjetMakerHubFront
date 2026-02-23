import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe-service';
import { RecipeDetailResponseDto } from '../../../interfaces/recipe.models';
import { unitLabel } from '../../../shared/unit-utils';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../core/services/token-service';
import { MatIconModule } from '@angular/material/icon';
import { PlanningService } from '../../../core/services/planning-service';
import { SlotType } from '../../../interfaces/Planning.models';
import { parseSlotType } from '../../../shared/slot-type-utils';
import { Location } from '@angular/common';


@Component({
  selector: 'app-recipe-detail',
  imports: [MatIconModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private tokenService = inject(TokenService);
  private planningService = inject(PlanningService)
  private location = inject(Location)

  planningMode = false;
  targetDay: string | null = null;
  targetType: SlotType | null = null;
  targetWeekStart: string | null = null;

  defaultPortion = 1;

  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<RecipeDetailResponseDto | null>(null);
  unitLabel = unitLabel
  recipeId = '';

  isOwner = false;
  isAdmin = false;

  apiOrigin = environment.baseUrl

  imgSrc(url?: string | null) {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${this.apiOrigin}${url}`;
  }

  ngOnInit() {
    // 1) lire les query params pour savoir si on vient du planning
    const qp = this.route.snapshot.queryParamMap;

    this.planningMode = qp.get('from') === 'planning';
    this.targetDay = qp.get('day');

    // attention : tu avais parfois weekstart en minuscule
    this.targetWeekStart = qp.get('weekStart') ?? qp.get('weekstart');

    // type doit devenir SlotType | null
    this.targetType = parseSlotType(qp.get('type'));

    // 2) lire le param route /recipe/:recipeId
    const id = this.route.snapshot.paramMap.get('recipeId');
    if (!id) {
      this.error.set('RecipeId manquant.');
      this.loading.set(false);
      return;
    }

    this.recipeId = id;
    this.fetch();
  }

  addToPlanning() {
    if (!this.planningMode) return;

    const day = this.targetDay;
    const weekStart = this.targetWeekStart;
    const type = this.targetType;

    if (!day || !weekStart || !type) {
      this.error.set("Paramètres planning manquants (day/weekStart/type).");
      return;
    }

    this.planningService.upsertSlot(weekStart, {
      date: day,
      type,
      portion: this.defaultPortion,
      recipeId: this.recipeId,
    }).subscribe({
      next: () => {
        // revenir sur home en gardant semaine + jour
        this.router.navigate(['/home'], { queryParams: { weekStart, day } });
      },
      error: (err) => {
        console.error('addToPlanning error', err);
        this.error.set("Impossible d'ajouter au planning.");
      }
    });
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);

    this.recipeService.getById(this.recipeId).subscribe({
      next: (res: any) => {
        this.data.set(res);
        const userId = this.tokenService.getUserId();
        this.isAdmin = this.tokenService.isAdmin();
        this.isOwner = res.createdByUserId === userId;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur chargement recette');
        this.loading.set(false);
      }
    });
  }

  toggleFavorite() {
    const r = this.data();
    if (!r) return;

    // on change l'affichage tout de suite (optimistic)
    const newValue = !r.isFavorite;
    this.data.set({ ...r, isFavorite: newValue });

    const call$ = newValue
      ? this.recipeService.addFavorite(this.recipeId)
      : this.recipeService.removeFavorite(this.recipeId);

    call$.subscribe({
      next: () => {
        // ok, rien à faire
      },
      error: (err) => {
        console.error('toggle favorite error', err);

        // rollback
        const cur = this.data();
        if (cur) this.data.set({ ...cur, isFavorite: !newValue });

        this.error.set("Impossible de modifier le favori.");
      }
    });
  }

  goUpdate() {
    // Option 1 (simple) : on ouvre une page dédiée edit (recommandé)
    this.router.navigate(['/recipe', this.recipeId, 'edit']);
  }

  deleteRecipe() {
    const r = this.data();
    if (!r) return;

    const ok = confirm(`Supprimer la recette "${r.title}" ?`);
    if (!ok) return;

    this.recipeService.delete(this.recipeId).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('delete recipe error', err);
        this.error.set('Suppression impossible.');
      }
    });
  }

  goBack() {
    this.location.back();
  }

}
