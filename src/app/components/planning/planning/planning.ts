import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { PlanningService } from '../../../core/services/planning-service';
import { PlanWeekDto, SlotType } from '../../../interfaces/Planning.models';
import { addDays, toDayStart, toIsoDate, weekStartMonday } from '../../../shared/date-utils';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule ],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class Planning implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  weekStartChange = output<Date>();

  private lastLoadedWeekIso: string | null = null;
  loading = signal(false);
  error: string | null = null;

  selectedWeekStart = signal<Date>(new Date());
  weekData = signal<PlanWeekDto | null>(null);

  weekOptions: { label: string; value: Date }[] = [];
  isoDateWeekStart = computed(() => toIsoDate(this.selectedWeekStart()));
  toIsoDate = toIsoDate;

  slotTypes: readonly SlotType[] = [1, 2, 3];

  activeIndex = signal(0);
  private dragging = false;
  private didDrag = false;
  private startX = 0;
  dragX = signal(0);

  weekPickerOpen = signal(false);

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
    
    const qsWeek = this.route.snapshot.queryParamMap.get('weekStart');  // recup les params ds l'url
    const qsDay = this.route.snapshot.queryParamMap.get('day');
    
    const weekBase = qsWeek ? parseIsoDate(qsWeek) : null;   // convertit les params en Date | null
    const dayBase = qsDay ? parseIsoDate(qsDay) : null;

    const monday = weekStartMonday(weekBase ?? dayBase ?? today);
    this.selectedWeekStart.set(monday);

    const refDay = dayBase ?? today;
    const idx = Math.max(
      0,
      Math.min(6, Math.floor((toDayStart(refDay).getTime() - toDayStart(monday).getTime()) / 86400000))
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

  openWeekPicker() { this.weekPickerOpen.set(true); }
  closeWeekPicker() { this.weekPickerOpen.set(false); }

  selectWeek(ws: Date) {
    this.selectedWeekStart.set(ws);
    this.activeIndex.set(0);
    this.weekStartChange.emit(ws);
    this.closeWeekPicker();
    this.loadWeek(ws);
  }

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

  prevCard() {
    this.activeIndex.set(Math.max(0, this.activeIndex() - 1));
  }

  nextCard() {
    this.activeIndex.set(Math.min(6, this.activeIndex() + 1));
  }

  onPointerDown(e: PointerEvent) {
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

  if (dx <= -threshold) {
    this.nextCard();
  } else if (dx >= threshold) {
    this.prevCard();
  }


  this.dragging = false;
  this.dragX.set(0);
}


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

    this.router.navigate(['/recipe/search'], {
      queryParams: {
        day: toIsoDate(day),
        type: type,
        weekStart: toIsoDate(this.selectedWeekStart()),
        from: 'planning'
      }
    });
    this.closeAddMenu();
  }

  goFavorites() {
    const day = this.addMenuDay();
    const type = this.addMenuType();
    if (!day || !type) return;

    this.router.navigate(['/recipe/favorite'], {
      queryParams: {
        day: toIsoDate(day),
        type: type,
        weekStart: toIsoDate(this.selectedWeekStart()),
        from: 'planning'
      }
    });
    this.closeAddMenu();
  }

  openRecipe(recipeId: string) {
    this.router.navigate(['/recipe', recipeId]);
  }

  removeSlot(slotId: string) {
  this.planningService.deleteSlot(slotId).subscribe({
    next: () => {
      this.loadWeek(this.selectedWeekStart(), true)
    },
    error: () => {
      //TODO toast
      this.loadWeek(this.selectedWeekStart(), true)
    },
  });
}
  // reload le planning
  private loadWeek(weekStart: Date, force = false) {
    const iso = toIsoDate(weekStart);
    if (!force && this.lastLoadedWeekIso === iso) return; // pas de reload si mm week sauf si force = true

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



function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  return new Date(y, mo - 1, d);
}
