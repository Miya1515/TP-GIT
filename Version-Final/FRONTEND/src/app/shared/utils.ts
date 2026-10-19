// Fonctions reprises telles quelles de js/app.js et js/admin.js
export function fmt(p: number | string): string {
  return Number(p).toFixed(2) + ' TND';
}
export function stockClass(s: number): string {
  return s === 0 ? 'out-stock' : s <= 5 ? 'low-stock' : 'in-stock';
}
export function stockLabel(s: number): string {
  return s === 0 ? 'Out of stock' : s <= 5 ? 'Low stock' : 'In stock';
}
export const sClass = stockClass;
export function tStatus(s: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  };
  return labels[s] || s;
}
export function fDate(d: string | null | undefined): string {
  return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}
export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

/** Équivalent de onerror="this.src='...'" (sans boucle infinie si l'image de secours échoue aussi). */
export function imgFallback(ev: Event, url: string): void {
  const img = ev.target as HTMLImageElement;
  if (img.src !== url) img.src = url;
}
