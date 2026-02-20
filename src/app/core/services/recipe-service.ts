import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecipeSearchRequestDto, RecipeSearchResponseDto } from '../../interfaces/recipe.models';
import { PagedResult } from '../../interfaces/paged-result';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private http = inject(HttpClient);
  private api = environment.apiBaseUrl;

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
}