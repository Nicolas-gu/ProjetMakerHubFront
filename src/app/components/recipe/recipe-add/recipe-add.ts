import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Unit } from '../../../interfaces/units.models';
import { RecipeCreateDto } from '../../../interfaces/recipe-create.models';
import { RecipeService } from '../../../core/services/recipe-service';
import { IngredientFG } from '../../../shared/ingredient-fg';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recipe-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule ],
  templateUrl: './recipe-add.html',
  styleUrl: './recipe-add.css',
})
export class RecipeAdd {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private location = inject(Location)

  Unit = Unit;

  saving = signal(false);
  error = signal<string | null>(null);

  selectedFile: File | null = null;

  

  // ✅ Formulaire principal (simple)
  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    basePortion: this.fb.nonNullable.control(2, [Validators.required, Validators.min(1)]),
    prepTime: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    cookTime: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),

    isPublic: this.fb.nonNullable.control(false),
    isFavorite: this.fb.nonNullable.control(false),

    // listes dynamiques
    steps: this.fb.array<FormControl<string>>([]),
    ingredients: this.fb.array<IngredientFG>([]),
  });

  // petits champs d'ajout (pas dans le form principal)
  stepText = this.fb.nonNullable.control('', Validators.required);

  ingredientName = this.fb.nonNullable.control('', Validators.required);
  ingredientQuantity = this.fb.control<number | null>(null);     // baseQuantity
  ingredientUnit = this.fb.nonNullable.control<Unit>(Unit.Unknown);
  ingredientQuantityText = this.fb.control<string | null>(null);

  // --------- getters ----------
  get stepsFA() {
    return this.form.controls.steps;
  }
  get ingredientsFA(): FormArray<IngredientFG> {
    return this.form.controls.ingredients as FormArray<IngredientFG>;
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  // ✅ Ajouter une étape (simple)
  addStep() {
    const text = this.stepText.value.trim();
    if (!text) return;

    this.stepsFA.push(this.fb.nonNullable.control(text));
    this.stepText.setValue('');
  }

  removeStep(i: number) {
    this.stepsFA.removeAt(i);
  }

  // ✅ Ajouter un ingrédient (3 champs + texte)
  addIngredient() {
    const name = this.ingredientName.value.trim();
    if (!name) return;

    const qtText = (this.ingredientQuantityText.value ?? '').trim();
    const qty = this.ingredientQuantity.value;
    const unit = this.ingredientUnit.value;

    // On crée un petit groupe pour 1 ingrédient
    const ing = this.fb.group({
      name: this.fb.nonNullable.control(name),
      baseQuantity: this.fb.control<number | null>(null),
      unit: this.fb.nonNullable.control<Unit>(Unit.Unknown),
      quantityText: this.fb.control<string | null>(null),
    });

    // règle simple : si quantityText est rempli => priorité au texte
    if (qtText) {
      ing.controls.quantityText.setValue(qtText);
      ing.controls.baseQuantity.setValue(null);
      ing.controls.unit.setValue(Unit.Unknown);
    } else {
      ing.controls.baseQuantity.setValue(qty ?? null);
      ing.controls.unit.setValue(unit ?? Unit.Unknown);
      ing.controls.quantityText.setValue(null);
    }

    this.ingredientsFA.push(ing);

    // reset champs
    this.ingredientName.setValue('');
    this.ingredientQuantity.setValue(null);
    this.ingredientUnit.setValue(Unit.Unknown);
    this.ingredientQuantityText.setValue(null);
  }

  removeIngredient(i: number) {
    this.ingredientsFA.removeAt(i);
  }

  // validation simple
  private validateBusiness(): string | null {
    if (this.ingredientsFA.length === 0) return 'Ajoute au moins 1 ingrédient.';
    return null;
  }

  createRecipe() {
    this.form.markAllAsTouched();
    this.error.set(null);

    if (this.form.invalid) {
      this.error.set('Formulaire invalide.');
      return;
    }

    const biz = this.validateBusiness();
    if (biz) {
      this.error.set(biz);
      return;
    }

    const dto: RecipeCreateDto = {
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
      basePortion: this.form.controls.basePortion.value,
      prepTime: this.form.controls.prepTime.value,
      cookTime: this.form.controls.cookTime.value,
      isPublic: this.form.controls.isPublic.value,

      // tags pas gérés ici => vide
      tagIds: [],

      steps: this.stepsFA.controls.map(c => c.value),

      ingredients: this.ingredientsFA.controls.map((g: any) => ({
        name: g.controls.name.value,
        baseQuantity: g.controls.baseQuantity.value,
        unit: g.controls.unit.value,
        quantityText: g.controls.quantityText.value,
      })),
    };

    this.saving.set(true);

    this.recipeService.create(dto).subscribe({
      next: (res) => {
        const id = res?.id;
        if (!id) {
          this.saving.set(false);
          this.error.set("Création OK mais l'API n'a pas renvoyé l'id.");
          return;
        }

        // favorite ensuite (optionnel)
        const afterFavorite = () => {
          // upload image ensuite (optionnel)
          if (this.selectedFile) {
            this.recipeService.uploadImage(id, this.selectedFile).subscribe({
              next: () => {
                this.saving.set(false);
                this.router.navigate(['/recipe', id]);
              },
              error: () => {
                this.saving.set(false);
                this.router.navigate(['/recipe', id]);
              }
            });
          } else {
            this.saving.set(false);
            this.router.navigate(['/recipe', id]);
          }
        };

        if (this.form.controls.isFavorite.value) {
          this.recipeService.addFavorite(id).subscribe({
            next: () => afterFavorite(),
            error: () => afterFavorite(),
          });
        } else {
          afterFavorite();
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error ?? 'Erreur création recette');
      }
    });
  }

  resetAll() {
    this.form.reset({
      title: '',
      description: '',
      basePortion: 2,
      prepTime: 0,
      cookTime: 0,
      isPublic: false,
      isFavorite: false,
    });

    this.stepsFA.clear();
    this.ingredientsFA.clear();

    this.stepText.setValue('');
    this.ingredientName.setValue('');
    this.ingredientQuantity.setValue(null);
    this.ingredientUnit.setValue(Unit.Unknown);
    this.ingredientQuantityText.setValue(null);

    this.selectedFile = null;
    this.error.set(null);
  }

  goBack() {
    this.location.back();
  }
}
