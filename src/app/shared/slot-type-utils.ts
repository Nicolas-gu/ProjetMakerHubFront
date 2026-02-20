import { SlotType } from "../interfaces/Planning.models";


export function parseSlotType(v: string | null): SlotType | null {
  if (v === '1') return 1;
  if (v === '2') return 2;
  if (v === '3') return 3;
  return null;
}