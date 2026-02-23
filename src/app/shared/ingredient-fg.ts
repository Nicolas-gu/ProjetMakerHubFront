import { FormControl, FormGroup } from '@angular/forms';
import { Unit } from '../interfaces/units.models';

export type IngredientFG = FormGroup<{
  name: FormControl<string>;
  baseQuantity: FormControl<number | null>;
  unit: FormControl<Unit>;
  quantityText: FormControl<string | null>;
}>;