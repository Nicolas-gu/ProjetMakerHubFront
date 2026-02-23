import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PantryItemDto } from '../../interfaces/pantry.models';

@Injectable({ providedIn: 'root' })
export class PantryService {

  // Dépendances
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getAll(): Observable<PantryItemDto[]> {
    return this.http.get<PantryItemDto[]>(`${this.api}/PantryItem`);
  }

  upsert(dto: { ingredientId: string; quantity: number; unit: number }): Observable<PantryItemDto | void> {
    return this.http.post<PantryItemDto | void>(`${this.api}/PantryItem`, dto);
  }

  delete(ingredientId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/PantryItem/${ingredientId}`);
  }
}