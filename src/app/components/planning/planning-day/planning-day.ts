import { CommonModule, NumberFormatStyle } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { PlanSlotDto, PlanWeekDto, SlotType } from '../../../interfaces/Planning.models';
import { toIsoDate } from '../../../shared/date-utils';

@Component({
  selector: 'app-planning-day',
  imports: [CommonModule],
  templateUrl: './planning-day.html',
  styleUrl: './planning-day.css',
})
export class PlanningDay {

  @Input({ required: true }) day!: Date;
  week = input.required<PlanWeekDto>()

  private isoDay(): string {
    return toIsoDate(this.day);
  }

  slot(type: number): PlanSlotDto | null {
    const iso = this.isoDay();
    return this.week().slots.find(s => s.date.startsWith(iso) && s.type === type) ?? null;
  }

  label(type: number): string {
    switch (type) {
      case 1: return 'Petit déjeuner';
      case 2: return 'Déjeuner';
      case 3: return 'Dîner';
      default: return 'Repas';
    }
  }
}
