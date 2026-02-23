import { Unit } from "./units.models";

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