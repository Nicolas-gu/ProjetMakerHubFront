import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TagDto } from '../../interfaces/tag.models';

@Injectable({
  providedIn: 'root',
})
export class TagService {

  // Dépendances
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getAll(): Observable<TagDto[]> {
    return this.http.get<TagDto[]>(`${this.api}/Tag`);
  }
}
