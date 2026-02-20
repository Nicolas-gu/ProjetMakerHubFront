
export enum Unit {
  Unknown = 0,
  Gram = 1,
  Kilogram = 2,
  Milliliter = 3,
  Liter = 4,
  Piece = 5,
  Teaspoon = 6,
  Tablespoon = 7,
  Pinch = 8,
}

export interface ShoppingListDto {
  id: string;
  weekStart: string;
  items: ShoppingListItemDto[];
}

export interface ShoppingListItemDto {
  id: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number | null;
  unit: Unit;
  quantityText: string | null;
  isChecked: boolean;
}

export interface ShoppingListItemCreateDto {
  ingredientId?: string | null;
  ingredientName?: string | null;
  quantity?: number | null;
  unit?: Unit | null;
  quantityText?: string | null;
}

export interface ShoppingListItemUpdateDto {
  quantity?: number | null;
  unit?: Unit | null;
  quantityText?: string | null;
  isChecked?: boolean | null;
}