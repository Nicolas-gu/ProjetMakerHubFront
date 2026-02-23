
// convertit Date en string
export function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// met l'heure du jour a 00.00.00
export function toDayStart(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// renvoie le lundi de la semaine
export function weekStartMonday(date: Date): Date {
  const d = toDayStart(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}