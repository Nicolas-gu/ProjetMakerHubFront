import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PlanningService } from '../../../core/services/planning-service';
import { PlanWeekDto, SlotType } from '../../../interfaces/Planning.models';
import { addDays, toIsoDate, weekStartMonday } from '../../../shared/date-utils';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class Planning implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);

  private lastLoadedWeekIso: string | null = null;
  loading = signal(false);
  error: string | null = null;

  selectedWeekStart = signal<Date>(new Date());
  weekData = signal<PlanWeekDto | null>(null);

  weekOptions: { label: string; value: Date }[] = [];
  isoDateWeekStart = computed(() => toIsoDate(this.selectedWeekStart()));
  toIsoDate = toIsoDate;

  // --- Slot types strongly typed (fix "number not assignable to SlotType")
  slotTypes: readonly SlotType[] = [1, 2, 3];

  // --- Deck
  activeIndex = signal(0);
  private dragging = false;
  private didDrag = false;
  private startX = 0;
  dragX = signal(0);

  // --- Week picker (drag up/down panel)
  weekPickerOpen = signal(false);

  // --- Add/Modify menu state (simple panel)
  addMenuOpen = signal(false);
  addMenuDay = signal<Date | null>(null);
  addMenuType = signal<SlotType | null>(null);

  weekDays = computed(() => {
    const ws = this.selectedWeekStart();
    return Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  });

  activeDay = computed(() => {
    const idx = Math.max(0, Math.min(6, this.activeIndex()));
    return this.weekDays()[idx];
  });

  ngOnInit(): void {
    const today = new Date();
    this.buildWeekOptions(today);

    const monday = weekStartMonday(today);
    this.selectedWeekStart.set(monday);

    const idx = Math.max(
      0,
      Math.min(6, Math.floor((toDayStart(today).getTime() - toDayStart(monday).getTime()) / 86400000))
    );
    this.activeIndex.set(idx);

    this.loadWeek(monday);
  }

  buildWeekOptions(base: Date) {
    const baseMonday = weekStartMonday(base);
    const option: { label: string; value: Date }[] = [];

    for (let i = -10; i <= 10; i++) {
      const ws = addDays(baseMonday, i * 7);
      option.push({
        label: `Semaine du ${ws.toLocaleDateString()}`,
        value: ws
      });
    }
    this.weekOptions = option;
  }

  // --- Week picker
  openWeekPicker() { this.weekPickerOpen.set(true); }
  closeWeekPicker() { this.weekPickerOpen.set(false); }

  selectWeek(ws: Date) {
    this.selectedWeekStart.set(ws);
    this.activeIndex.set(0);
    this.closeWeekPicker();
    this.loadWeek(ws);
  }

  // --- Slot helpers
  label(type: SlotType): string {
    switch (type) {
      case 1: return 'Petit déjeuner';
      case 2: return 'Déjeuner';
      case 3: return 'Dîner';
      default: return 'Repas';
    }
  }

  slotFor(day: Date, type: SlotType) {
    const w = this.weekData();
    if (!w) return null;
    const iso = toIsoDate(day);
    return w.slots.find(s => s.date.startsWith(iso) && s.type === type) ?? null;
  }

  // --- Deck navigation
  prevCard() {
    this.activeIndex.set(Math.max(0, this.activeIndex() - 1));
  }

  nextCard() {
    this.activeIndex.set(Math.min(6, this.activeIndex() + 1));
  }

  // --- Pointer drag: finger left => next day
  onPointerDown(e: PointerEvent) {
    // ✅ si on clique sur un bouton / élément cliquable, pas de drag
    const target = e.target as HTMLElement;
    if (target.closest('button, a, select, input, textarea, .recipe-chip')) return;

    this.dragging = true;
    this.didDrag = false;
    this.startX = e.clientX;
    this.dragX.set(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    const dx = e.clientX - this.startX;
    this.dragX.set(dx);
    if (Math.abs(dx) > 8) this.didDrag = true;
  }

  onPointerUp() {
    if (!this.dragging) return;

    const dx = this.dragX();
    const threshold = 60;

    if (dx <= -threshold) this.nextCard(); // doigt vers la gauche => jour suivant
    else if (dx >= threshold) this.prevCard(); // doigt vers la droite => jour précédent

    this.dragging = false;
    this.dragX.set(0);
  }

  // clicking a non-active card selects it; active card itself doesn't open anything now
  onCardClick(i: number) {
    if (this.didDrag) return;
    if (i !== this.activeIndex()) this.activeIndex.set(i);
  }

  cardStyle(i: number) {
    const idx = this.activeIndex();
    const delta = i - idx;
    const abs = Math.abs(delta);

    const visible = abs <= 4;
    const baseX = delta * 34;
    const drag = (delta === 0 ? this.dragX() : 0);

    const scale = 1 - Math.min(abs, 4) * 0.06;
    const y = Math.min(abs, 4) * 10;
    const rot = delta * 1.2;
    const opacity = 1 - Math.min(abs, 4) * 0.12;
    const z = 100 - abs;

    return {
      display: visible ? 'block' : 'none',
      transform: `translate3d(${baseX + drag}px, ${y}px, 0) scale(${scale}) rotate(${rot}deg)`,
      opacity: `${opacity}`,
      zIndex: `${z}`,
      pointerEvents: abs > 2 ? 'none' : 'auto',
    } as const;
  }

  // --- Add / Modify menu
  openAddMenu(day: Date, type: SlotType) {
    this.addMenuDay.set(day);
    this.addMenuType.set(type);
    this.addMenuOpen.set(true);
  }

  closeAddMenu() {
    this.addMenuOpen.set(false);
    this.addMenuDay.set(null);
    this.addMenuType.set(null);
  }

  goSearch() {
    const day = this.addMenuDay();
    const type = this.addMenuType();
    if (!day || !type) return;

    // TODO: route réelle
    // this.router.navigate(['/recipes/search'], { queryParams: { day: toIsoDate(day), type } });
    this.router.navigate(['/recipes/search']);
    this.closeAddMenu();
  }

  goFavorites() {
    const day = this.addMenuDay();
    const type = this.addMenuType();
    if (!day || !type) return;

    // TODO: route réelle
    // this.router.navigate(['/recipes/favorites'], { queryParams: { day: toIsoDate(day), type } });
    this.router.navigate(['/recipes/favorites']);
    this.closeAddMenu();
  }

  // --- Recipe detail navigation (placeholder)
  openRecipe(recipeId: string) {
    // TODO: route réelle + fetch details
    this.router.navigate(['/recipes', recipeId]);
  }

  removeSlot(slotId: string) {
    const w = this.weekData();
    if (!w) return;

    // optimistic
    this.weekData.set({ ...w, slots: w.slots.filter(s => s.slotId !== slotId) });

    // TODO: call API delete
  }

  private loadWeek(weekStart: Date) {
    const iso = toIsoDate(weekStart);
    if (this.lastLoadedWeekIso === iso) return;

    this.lastLoadedWeekIso = iso;
    this.loading.set(true);
    this.error = null;

    this.planningService.getWeek(iso).subscribe({
      next: (data) => {
        this.weekData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Erreur chargement planning';
        this.loading.set(false);
        this.lastLoadedWeekIso = null;
      }
    });
  }
}

function toDayStart(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
