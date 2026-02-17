
export type SlotType = 1 | 2 | 3;

export interface PlanSlotDto {
  slotId: string;
  date: string;
  type: SlotType;
  portion: number;
  recipeId: string;
  recipeTitle: string;
  prepTime: number;
  cookTime: number;
}

export interface PlanWeekDto {
  planId: string;
  weekStart: Date;
  slots: PlanSlotDto[];
}
