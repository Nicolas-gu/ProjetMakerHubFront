
export function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function weekStartMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const day = d.getDay(); // 0=dim, 1=lun...
  const diff = (day === 0 ? -6 : 1) - day; // ramène à lundi
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}