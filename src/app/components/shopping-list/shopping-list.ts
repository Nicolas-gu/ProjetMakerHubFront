import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListService } from '../../core/services/shopping-list-service';
import { ShoppingListDto } from '../../interfaces/shopping-list.models';
import { formatQuantity } from '../../shared/unit-utils';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toIsoDate, weekStartMonday } from '../../shared/date-utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList implements OnInit{
  private route = inject(ActivatedRoute);
  private shoppingListService = inject(ShoppingListService);
  private location = inject(Location);

  formatQuantity = formatQuantity;

  weekStartIso: string | null = null;

  data: WritableSignal<ShoppingListDto | null> = signal(null);
  loading = signal(false);
  error: WritableSignal<string | null> = signal(null);

  newIngredientName = '';
  newQuantityText = '';

  ngOnInit(): void {
    this.weekStartIso = this.route.snapshot.queryParamMap.get('weekStart')
    ?? toIsoDate(weekStartMonday(new Date()));
    this.load();
  }

  load() {
    const ws = this.weekStartIso;
    if (!ws) {
      this.error.set('Semaine manquante.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.shoppingListService.getByWeek(ws).subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);

      },
      error: (err) => {
        this.loading.set(false);
      }
  });
}


  toggle(itemId: string, isChecked: boolean) {
    this.shoppingListService.patchItem(itemId, { isChecked }).subscribe({
      next: () => {
        const it = this.data()?.items.find(i => i.id === itemId);
        if (it) it.isChecked = isChecked;
      }
    });
  }

  updateQuantityText(itemId: string, quantityText: string) {
    this.shoppingListService.patchItem(itemId, { quantityText }).subscribe({
      next: () => {
        const it = this.data()?.items.find(i => i.id === itemId);
        if (it) it.quantityText = quantityText;
      }
    });
  }

  remove(itemId: string) {
    this.shoppingListService.deleteItem(itemId).subscribe({
      next: () => {
        if (!this.data()) return;
        this.data()!.items = this.data()!.items.filter(i => i.id !== itemId);
      }
    });
  }

  addManual() {
    if (!this.weekStartIso) return;

    const name = this.newIngredientName.trim();
    if (!name) return;

    this.shoppingListService.addItem(this.weekStartIso, {
      ingredientName: name,
      quantityText: this.newQuantityText?.trim() || null
    }).subscribe({
      next: () => {
        this.newIngredientName = '';
        this.newQuantityText = '';
        this.load();
      }
    });
  }

  goBack() {
    this.location.back();
  }
}