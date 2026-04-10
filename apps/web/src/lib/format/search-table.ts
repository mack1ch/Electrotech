import type { ApiProduct } from '@/lib/types/catalog';

export const PRICE_ON_REQUEST_LABEL = 'По запросу';

export function isPriceOnRequest(price: string): boolean {
  return price.trim() === PRICE_ON_REQUEST_LABEL;
}

/** Цена в ячейке таблицы: «118,3 ₽» или «По запросу». */
export function formatTablePriceRub(value: string | number): string {
  if (typeof value === 'string' && isPriceOnRequest(value)) {
    return PRICE_ON_REQUEST_LABEL;
  }
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) {
    return String(value);
  }
  return `${new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n)} ₽`;
}

export function formatStockUnits(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n);
}

export function formatTableDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  const [y, m, d] = iso.slice(0, 10).split('-');
  if (!y || !m || !d) {
    return iso;
  }
  return `${d}.${m}.${y}`;
}

export function displayArticle(p: Pick<ApiProduct, 'article' | 'sku'>): string {
  return p.article ?? p.sku ?? '—';
}

/** Разбивка названия кабеля как в макете: «…-» / «LS …» */
export function splitProductTitle(name: string): [string, string] | null {
  const idx = name.search(/-LS/i);
  if (idx === -1) {
    return null;
  }
  return [name.slice(0, idx + 1), name.slice(idx + 1)];
}

/** «118,3 ₽/шт» для мобильной карточки (Figma 0:2065) */
export function formatMobilePricePerPiece(price: string): string {
  if (isPriceOnRequest(price)) {
    return PRICE_ON_REQUEST_LABEL;
  }
  const n = Number.parseFloat(price);
  if (Number.isNaN(n)) {
    return `${price} ₽/шт`;
  }
  return `${new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n)} ₽/шт`;
}

export function mobileAvailabilityPrimary(p: ApiProduct): string {
  if (p.category?.slug === 'cable') {
    const km = Math.max(1, Math.round((p.stockQuantity ?? 0) / 267));
    return String(km);
  }
  return new Intl.NumberFormat('ru-RU').format(p.stockQuantity ?? 0);
}

export function mobileAvailabilityUnit(p: ApiProduct): string {
  return p.category?.slug === 'cable' ? 'км' : 'шт';
}
