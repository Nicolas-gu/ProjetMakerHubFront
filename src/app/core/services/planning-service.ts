import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanWeekDto } from '../../interfaces/Planning.models';
import { environment } from '../../../environments/environment';
import { PlanSlotAddDto } from '../../interfaces/planning-slot-add.models';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {

  // Dépendances
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getWeek(weekStart: string): Observable<PlanWeekDto> {
    return this.http.get<PlanWeekDto>(`${this.api}/Plan/${weekStart}`);
  }

  upsertSlot(weekStartIso: string, dto: PlanSlotAddDto) {
    return this.http.post<void>(`${this.api}/Plan/${weekStartIso}/slots`, dto);
  }

  deleteSlot(slotId: string){
    return this.http.delete<void>(`${this.api}/Plan/slots/${slotId}`);
  }
}

