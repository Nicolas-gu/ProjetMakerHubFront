
export interface RecipeSearchResponseDto {
  id: string;
  title: string;
  isPublic: boolean;
  isFavorite: boolean;
  cookTime: number;
  prepTime: number;
}

export interface RecipeSearchRequestDto {
  q?: string | null;
  tagIds?: string[];
  favorite?: boolean;
  mine?: boolean;
  page?: number;
  pageSize?: number;
}