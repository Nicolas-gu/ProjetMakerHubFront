import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlanWeekDto } from '../../interfaces/Planning.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getWeek(weekStart: string): Observable<PlanWeekDto> {
    return this.http.get<PlanWeekDto>(`${this.api}/plan`, new Date(weekStart).toLocaleDateString);
  }
}
