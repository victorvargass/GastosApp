export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseAmount(value: string): number | null {
  const cleaned = value.replace(/\./g, '').replace(/,/g, '').trim();
  if (!cleaned) return null;
  const num = parseInt(cleaned, 10);
  return Number.isNaN(num) || num <= 0 ? null : num;
}

export function formatMonth(month: string | null): string {
  if (!month) return '';

  const [year, monthNumber] = month.split('-');

  const names = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];

  return `${names[Number(monthNumber) - 1]}-${year.slice(2)}`;
}