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

  // Dépendances
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
    // recup info ds les query
    const qp = this.route.snapshot.queryParamMap;
    this.planningMode = qp.get('from') === 'planning';
    this.targetDay = qp.get('day');
    this.targetWeekStart = qp.get('weekStart');
    this.targetType = parseSlotType(qp.get('type'));
    // recup id dans la route
    const id = this.route.snapshot.paramMap.get('recipeId');
    if (!id) {
      this.error.set('RecipeId manquant.');
      this.loading.set(false);
      return;
    }
    this.recipeId = id;
    this.fetch();
  }

  // charge la recette
  fetch() {
    this.loading.set(true);
    this.error.set(null);

    this.recipeService.getById(this.recipeId).subscribe({
      next: (res) => {
        this.data.set(res);

        const userId = this.tokenService.getUserId();
        this.isAdmin = this.tokenService.isAdmin();
        this.isOwner = res.createdBy === userId;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur chargement recette');
        this.loading.set(false);
      }
    });
  }

  // pour ajouter la recette au planning (si planningMode)
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
        this.router.navigate(['/home'], { queryParams: { weekStart, day } });
      },
      error: (err) => {
        console.error('addToPlanning error', err);
        this.error.set("Impossible d'ajouter au planning.");
      }
    });
  }

  toggleFavorite() {
    // recup recette
    const r = this.data();
    if (!r) return;
    // si favorite => set false et inversement
    const newValue = !r.isFavorite;
    // copie la recette et change isFavorite
    this.data.set({ ...r, isFavorite: newValue });
    
    const call$ = newValue
      ? this.recipeService.addFavorite(this.recipeId)
      : this.recipeService.removeFavorite(this.recipeId);

    call$.subscribe({
      next: () => {
      },
      error: () => {
        // reviens a l'etat precedent si requete echoue
        const cur = this.data();
        if (cur) this.data.set({ ...cur, isFavorite: !newValue });
        
        this.error.set("Impossible de modifier le favori.");
      }
    });
  }

  // navigue sur recipe-edite
  goUpdate() {
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
