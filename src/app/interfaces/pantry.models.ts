
export interface PantryItemDto {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: number;
  quantityText?: string | null;
}

export interface PantryUpsertDto {
  ingredientId?: string | null;
  ingredientName?: string | null;
  quantity?: number | null;
  unit?: number | null;
  quantityText?: string | null;
}