
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

export interface RecipeDetailResponseDto {
  title: string;
  description: string;
  basePortion: number;
  prepTime: number;
  cookTime: number;
  isPublic: boolean;
  isFavorite: boolean;
  steps: string[];
  tags: string[];
  ingredients: IngredientDetailDto[];
  imageUrl?: string | null;
}

export interface IngredientDetailDto {
  name: string;
  quantity?: number | null;
  quantityText?: string | null;
  unit: number;
}