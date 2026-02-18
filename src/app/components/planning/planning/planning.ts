import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PlanningService } from '../../../core/services/planning-service';
import { PlanWeekDto } from '../../../interfaces/Planning.models';
import { addDays, toIsoDate, weekStartMonday } from '../../../shared/date-utils';
import { PlanningDay } from '../planning-day/planning-day';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planning',
  imports: [PlanningDay, CommonModule, FormsModule],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class Planning implements OnInit{

  private planningService = inject(PlanningService);

  private lastLoadedWeekIso: string | null = null;
  loading = signal(false);
  error: string | null = null;

  selectedWeekStart = signal<Date>(new Date());
  selectedDay = signal<Date>(new Date());
  weekData = signal<PlanWeekDto | null>(null);
  weekOptions: { label: string; value: Date}[] = [];
  isoDateWeekStart = computed(() => toIsoDate(this.selectedWeekStart()));
  toIsoDate = toIsoDate

  ngOnInit(): void {
    const today = new Date();
    this.buildWeekOptions(today);

    this.selectedWeekStart.set(weekStartMonday(today));
    console.log(this.isoDateWeekStart())
    this.loadWeek(this.selectedWeekStart());
  }

  buildWeekOptions(base: Date){
    const baseMonday = weekStartMonday(base);
    const option: { label: string; value: Date}[] = [];

    for(let i = -6; i <= 2; i++){
      const ws = addDays(baseMonday, i * 7);
      option.push({
        label: `Semaine du ${ws.toLocaleDateString()}`,
        value: ws
      });
    }
    this.weekOptions = option;
  }

  onWeekChangeValue(value: string) {
    const [y, m, d] = value.split('-').map(Number);
    this.selectedWeekStart.set(new Date(y, m - 1, d));
    this.selectedDay.set(new Date(this.selectedWeekStart()));
    this.loadWeek(this.selectedWeekStart());
  }


  prevDay(){
    this.selectedDay.set(addDays(this.selectedDay(), -1));
    const newWeekStart = weekStartMonday(this.selectedDay());
    if(toIsoDate(newWeekStart) !== toIsoDate(this.selectedWeekStart())){
      this.selectedWeekStart.set(newWeekStart);
      this.loadWeek(newWeekStart);
    }
  }

  nextDay(){
    this.selectedDay.set(addDays(this.selectedDay(),1));
    const newWeekStart = weekStartMonday(this.selectedDay());
    if(toIsoDate(newWeekStart) !== toIsoDate(this.selectedWeekStart())){
      this.selectedWeekStart.set(newWeekStart);
      this.loadWeek(newWeekStart);
    }
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
