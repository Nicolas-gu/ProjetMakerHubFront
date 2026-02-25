import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Unit } from '../../../interfaces/units.models';
import { RecipeService } from '../../../core/services/recipe-service';
import { IngredientFG } from '../../../shared/ingredient-fg';
import { TagDto } from '../../../interfaces/tag.models';
import { unitLabel } from '../../../shared/unit-utils';
import { TagService } from '../../../core/services/tag-service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './recipe-edit.html',
  styleUrl: './recipe-edit.css',
})
export class RecipeEdit {

  // Dépendances
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private tagService = inject(TagService);
  private location = inject(Location)

  Unit = Unit;
  unitLabel = unitLabel;

  recipeId = '';

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  tagsLoading = signal(false);
  allTags = signal<TagDto[]>([]);

  selectedFile: File | null = null;
  selectedFileName = signal<string | null>(null);

  // Formulaire
  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    basePortion: this.fb.nonNullable.control(2, [Validators.required, Validators.min(1)]),
    prepTime: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    cookTime: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    isPublic: this.fb.nonNullable.control(false),

    tagIds: this.fb.nonNullable.control<string[]>([]),

    steps: this.fb.array<FormControl<string>>([]),
    ingredients: this.fb.array<IngredientFG>([]), // on pousse des FormGroup
  });

  stepText = this.fb.nonNullable.control('', Validators.required);

  ingredientName = this.fb.nonNullable.control('', Validators.required);
  ingredientQuantity = this.fb.control<number | null>(null);
  ingredientUnit = this.fb.nonNullable.control<Unit>(Unit.Unknown);
  ingredientQuantityText = this.fb.control<string | null>(null);

  ngOnInit() {
    // Récup l'Id dans la route
    const id = this.route.snapshot.paramMap.get('recipeId');
    if (!id) {
      this.error.set('RecipeId manquant.');
      this.loading.set(false);
      return;
    }

    this.recipeId = id;
    this.loadTags();
    this.load();
  }

  // chargement des tags
  loadTags() {
    this.tagsLoading.set(true);
    this.tagService.getAll().subscribe({
      next: (tags) => {
        this.allTags.set(tags ?? []);
        this.tagsLoading.set(false);
      },
      error: () => {
        this.tagsLoading.set(false);
      }
    });
  }

  // chargement de la recette, step et ingredient
  load() {
    this.loading.set(true);
    this.error.set(null);

    // recette
    this.recipeService.getById(this.recipeId).subscribe({
      next: (r: any) => {
        this.form.patchValue({
          title: r.title ?? '',
          description: r.description ?? '',
          basePortion: r.basePortion ?? 2,
          prepTime: r.prepTime ?? 0,
          cookTime: r.cookTime ?? 0,
          isPublic: !!r.isPublic,
          tagIds: r.tagIds
        });

        // steps
        this.stepsFA.clear();
        for (const s of (r.steps ?? [])) {
          this.stepsFA.push(this.fb.nonNullable.control(String(s)));
        }

        // ingredients
        this.ingredientsFA.clear();
        for (const i of (r.ingredients ?? [])) {
          const fg = this.makeIngredientFG({
            name: i.name,
            baseQuantity: i.quantity ?? null,
            unit: i.unit ?? Unit.Unknown,
            quantityText: i.quantityText ?? null,
          });
          this.ingredientsFA.push(fg);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur chargement recette');
        this.loading.set(false);
      }
    });
  }
  
  isTagSelected(id: string): boolean {
    return this.form.controls.tagIds.value.includes(id);
  }

  toggleTag(id: string) {
    const cur = this.form.controls.tagIds.value;
    if (cur.includes(id)) {
      this.form.controls.tagIds.setValue(cur.filter(x => x !== id));
    } else {
      this.form.controls.tagIds.setValue([...cur, id]);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.selectedFile = f;
    this.selectedFileName.set(f ? f.name : null);
  }

  get stepsFA() {
    return this.form.controls.steps;
  }
  get ingredientsFA(): FormArray<IngredientFG> {
    return this.form.controls.ingredients as FormArray<IngredientFG>;
  }

  // creation d'un ingredient
  private makeIngredientFG(data?: Partial<{
    name: string;
    baseQuantity: number | null;
    unit: Unit;
    quantityText: string | null;
  }>): IngredientFG {
    return this.fb.group({
      name: this.fb.nonNullable.control(data?.name ?? '', Validators.required),
      baseQuantity: this.fb.control<number | null>(data?.baseQuantity ?? null),
      unit: this.fb.nonNullable.control<Unit>(data?.unit ?? Unit.Unknown),
      quantityText: this.fb.control<string | null>(data?.quantityText ?? null),
    });
  }

  addStep() {
    const t = this.stepText.value.trim();
    if (!t) return;
    this.stepsFA.push(this.fb.nonNullable.control(t));
    this.stepText.setValue('');
  }

  removeStep(i: number) {
    this.stepsFA.removeAt(i);
  }

  addIngredient() {
    const name = this.ingredientName.value.trim();
    if (!name) return;

    const qtText = (this.ingredientQuantityText.value ?? '').trim();
    const qty = this.ingredientQuantity.value;
    const unit = this.ingredientUnit.value;

    const fg = this.makeIngredientFG({ name });

    if (qtText) {
      fg.controls.quantityText.setValue(qtText);
      fg.controls.baseQuantity.setValue(null);
      fg.controls.unit.setValue(Unit.Unknown);
    } else {
      fg.controls.baseQuantity.setValue(qty ?? null);
      fg.controls.unit.setValue(unit ?? Unit.Unknown);
      fg.controls.quantityText.setValue(null);
    }

    this.ingredientsFA.push(fg);

    this.ingredientName.setValue('');
    this.ingredientQuantity.setValue(null);
    this.ingredientUnit.setValue(Unit.Unknown);
    this.ingredientQuantityText.setValue(null);
  }

  removeIngredient(i: number) {
    this.ingredientsFA.removeAt(i);
  }

  save() {
    this.form.markAllAsTouched();
    this.error.set(null);

    if (this.form.invalid) {
      this.error.set('Formulaire invalide.');
      return;
    }
    // map éléments du form vers dto
    const dto = {
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
      basePortion: this.form.controls.basePortion.value,
      prepTime: this.form.controls.prepTime.value,
      cookTime: this.form.controls.cookTime.value,
      isPublic: this.form.controls.isPublic.value,
      tagIds: this.form.controls.tagIds.value,
      steps: this.stepsFA.controls.map(c => c.value),
      ingredients: this.ingredientsFA.controls.map((g: any) => ({
        name: g.controls.name.value,
        quantity: g.controls.baseQuantity.value,
        unit: g.controls.unit.value,
        quantityText: g.controls.quantityText.value,
      })),
    };

    this.saving.set(true);

    // update recette
    this.recipeService.update(this.recipeId, dto).subscribe({
      next: () => {
        // upload image
        if (this.selectedFile) {
          this.recipeService.uploadImage(this.recipeId, this.selectedFile).subscribe({
            next: () => {
              this.saving.set(false);
              this.router.navigate(['/recipe', this.recipeId]);
            },
            error: (err) => {
              console.error('upload image error', err);
              this.saving.set(false);
              this.error.set("Recette mise à jour, mais l'image n'a pas pu être upload.");
             
            }
          });
        } else {
          this.saving.set(false);
          this.router.navigate(['/recipe', this.recipeId]);
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'Erreur mise à jour');
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
