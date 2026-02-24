import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecipeDetailResponseDto, RecipeSearchRequestDto, RecipeSearchResponseDto } from '../../interfaces/recipe.models';
import { PagedResult } from '../../interfaces/paged-result';
import { RecipeCreatedResponseDto, RecipeCreateDto } from '../../interfaces/recipe-create.models';

@Injectable({ providedIn: 'root' })
export class RecipeService {

  // Dépendances
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

  getById(recipeId: string) {
    return this.http.get<RecipeDetailResponseDto>(`${this.api}/Recipe/${recipeId}`);
  }

  create(dto: RecipeCreateDto): Observable<RecipeCreatedResponseDto> {
    return this.http.post<RecipeCreatedResponseDto>(`${this.api}/Recipe`, dto);
  }

  addFavorite(recipeId: string): Observable<void> {
    return this.http.post<void>(`${this.api}/Recipe/${recipeId}/favorite`, {});
  }

  removeFavorite(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/Recipe/${recipeId}/favorite`, {});
  }

  uploadImage(recipeId: string, file: File): Observable<{ imageUrl: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.api}/Recipe/${recipeId}/image`, form);
  }

  search(req: RecipeSearchRequestDto): Observable<PagedResult<RecipeSearchResponseDto>> {
    let params = new HttpParams();

    if (req.q) params = params.set('q', req.q);
    if (req.favorite) params = params.set('favorite', req.favorite);
    if (req.mine) params = params.set('mine', req.mine);
    if (req.page) params = params.set('page', req.page);
    if (req.pageSize) params = params.set('pageSize', req.pageSize);

    req.tagIds?.forEach(id => {
      params = params.append('tagIds', id);
    });

    return this.http.get<PagedResult<RecipeSearchResponseDto>>(
      `${this.api}/Recipe`,
      { params }
    );
  }

  favorites(page = 1, pageSize = 20) {
    return this.search({
      favorite: true,
      page,
      pageSize
    });
  }

  update(recipeId: string, dto: any) {
    return this.http.put<void>(`${this.api}/Recipe/${recipeId}`, dto);
  }

  delete(recipeId: string) {
    return this.http.delete<void>(`${this.api}/Recipe/${recipeId}`);
  }
}