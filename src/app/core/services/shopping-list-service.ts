import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ShoppingListDto, ShoppingListItemCreateDto, ShoppingListItemUpdateDto } from '../../interfaces/shopping-list.models';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getByWeek(weekStart: string): Observable<ShoppingListDto>{
    const params = new HttpParams().set('weekStart', weekStart);
    return this.http.get<ShoppingListDto>(`${this.api}/ShoppingList`, { params });
  }

  generate(weekStart: string): Observable<ShoppingListDto>{
    return this.http.post<ShoppingListDto>(`${this.api}/ShoppingList/${weekStart}/generate`, {});
  }

  addItem(weekStart: string, payload: ShoppingListItemCreateDto): Observable<ShoppingListDto> {
    return this.http.post<ShoppingListDto>(`${this.api}/ShoppingList/${weekStart}/items`, payload);
  }

  patchItem(itemId: string, patch: ShoppingListItemUpdateDto): Observable<void> {
    return this.http.patch<void>(`${this.api}/ShoppingList/items/${itemId}`, patch);
  }

  deleteItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/ShoppingList/items/${itemId}`);
  }
}
