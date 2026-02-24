import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PantryService } from '../../core/services/pantry-service';
import { PantryItemDto } from '../../interfaces/pantry.models';
import { Unit } from '../../interfaces/units.models';
import { unitLabel } from '../../shared/unit-utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './pantry.html',
  styleUrl: './pantry.css',
})
export class Pantry implements OnInit {
  private pantryService = inject(PantryService);
  private location = inject(Location)

  loading = signal(false);
  error = signal<string | null>(null);
  items = signal<PantryItemDto[]>([]);

  // form simple (niveau étudiant)
  newIngredientId = signal<string>('');  
  newIngredientName = signal<string>(''); 
  newQuantity = signal<number | null>(null);
  newUnit = signal<Unit>(Unit.Gram);

  // mode édition
  editingId = signal<string | null>(null);
  editQuantity = signal<number | null>(null);
  editUnit = signal<Unit>(Unit.Gram);

  Unit = Unit;
  unitLabel = unitLabel;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.pantryService.getAll().subscribe({
      next: (data) => {
        this.items.set(data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur chargement pantry');
        this.loading.set(false);
      },
    });
  }

  

  addNew() {
    const ingredientName = this.newIngredientName().trim();
    const q = this.newQuantity();
    const u = this.newUnit();

    if (!ingredientName) {
      this.error.set("IngredientId requis (pour l'instant).");
      return;
    }
    if (q === null || q < 0) {
      this.error.set('Quantité invalide.');
      return;
    }

    this.pantryService.upsert({
      ingredientName: ingredientName,
      quantity: q,
      unit: u,
    }).subscribe({
      next: () => {
        this.newIngredientName.set('');
        this.newQuantity.set(null);
        this.newUnit.set(Unit.Gram);
        this.load();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur ajout');
      },
    });
  }

  remove(item: PantryItemDto) {
    const ok = confirm(`Supprimer "${item.ingredientName}" du stock maison ?`);
    if (!ok) return;

    this.pantryService.delete(item.ingredientId).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur suppression');
      },
    });
  }

  goBack() {
    this.location.back();
  }

}



  // startEdit(item: PantryItemDto) {
  //   this.editingId.set(item.ingredientId);
  //   this.editQuantity.set(item.quantity ?? 0);
  //   this.editUnit.set(item.unit as Unit);
  // }

  // cancelEdit() {
  //   this.editingId.set(null);
  //   this.editQuantity.set(null);
  //   this.editUnit.set(Unit.Gram);
  // }

  // saveEdit(item: PantryItemDto) {
  //   const q = this.editQuantity();
  //   const u = this.editUnit();

  //   if (q === null || q < 0) {
  //     this.error.set('Quantité invalide.');
  //     return;
  //   }

  //   this.pantryService.upsert({
  //     ingredientId: item.ingredientId,
  //     quantity: q,
  //     unit: u,
  //   }).subscribe({
  //     next: () => {
  //       this.cancelEdit();
  //       this.load();
  //     },
  //     error: (err) => {
  //       this.error.set(err?.error?.message ?? 'Erreur modification');
  //     },
  //   });
  // }