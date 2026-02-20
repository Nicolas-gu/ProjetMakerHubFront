import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanWeekDto, SlotType } from '../../interfaces/Planning.models';
import { environment } from '../../../environments/environment';
import { toIsoDate } from '../../shared/date-utils';
import { PlanSlotAddDto } from '../../interfaces/planning-slot-add.models';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getWeek(weekStart: string): Observable<PlanWeekDto> {
    return this.http.get<PlanWeekDto>(`${this.api}/plan/${weekStart}`);
  }

  upsertSlot(weekStartIso: string, dto: PlanSlotAddDto) {
    return this.http.post<void>(`${this.api}/Plan/${weekStartIso}/slots`, dto);
  }
  deleteSlot(slotId: string){
    return this.http.delete<void>(`${this.api}/plan/slots/${slotId}`);
  }
}

