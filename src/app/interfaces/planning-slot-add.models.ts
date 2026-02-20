import { SlotType } from "./Planning.models";

export interface PlanSlotAddDto {
  date: string;
  type: SlotType;
  recipeId: string;
  portion: number;
}