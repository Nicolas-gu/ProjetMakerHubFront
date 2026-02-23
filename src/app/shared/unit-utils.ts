import { Unit } from "../interfaces/units.models";


export function unitLabel(u: Unit): string {
  switch (u) {
    case Unit.Gram: return 'g';
    case Unit.Kilogram: return 'kg';
    case Unit.Milliliter: return 'ml';
    case Unit.Liter: return 'L';
    case Unit.Piece: return 'pc';
    case Unit.Teaspoon: return 'càc';
    case Unit.Tablespoon: return 'càs';
    case Unit.Pinch: return 'pincée';
    default: return '';
  }
}

export function formatQuantity(
  quantity: number | null,
  unit: Unit,
  quantityText: string | null
): string {
  if (quantityText && quantityText.trim().length > 0) {
    return quantityText;
  }

  if (quantity == null) return '';

  const label = unitLabel(unit);
  return label ? `${quantity} ${label}` : `${quantity}`;
}