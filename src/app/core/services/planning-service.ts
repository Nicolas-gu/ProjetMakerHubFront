import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanWeekDto } from '../../interfaces/Planning.models';
import { environment } from '../../../environments/environment';
import { toIsoDate } from '../../shared/date-utils';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getWeek(weekStart: string): Observable<PlanWeekDto> {
    return this.http.get<PlanWeekDto>(`${this.api}/plan/${weekStart}`);
  }
}

