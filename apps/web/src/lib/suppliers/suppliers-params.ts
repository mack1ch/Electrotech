/** Параметры страницы списка поставщиков в URL и для GET /suppliers. */

import { DEFAULT_PAGE_SIZE } from '@/lib/search/search-params';

export const SUPPLIER_SORT_VALUES = ['name_asc', 'name_desc'] as const;

export type SuppliersSortParam = (typeof SUPPLIER_SORT_VALUES)[number];

export const SUPPLIERS_SORT_LABELS: Record<SuppliersSortParam, string> = {
  name_asc: 'Название: А → Я',
  name_desc: 'Название: Я → А',
};

export type SuppliersUrlState = {
  q: string;
  category: string;
  /** Город склада; пусто — «Любое». */
  warehouse: string;
  sort: SuppliersSortParam;
  page: number;
  pageSize: number;
};

function parsePositiveInt(v: string | undefined, fallback: number, max?: number): number {
  const n = Number.parseInt(v ?? '', 10);
  if (Number.isNaN(n) || n < 1) {
    return fallback;
  }
  if (max != null) {
    return Math.min(n, max);
  }
  return n;
}

export function parseSuppliersSort(v: string | undefined): SuppliersSortParam {
  if (v && (SUPPLIER_SORT_VALUES as readonly string[]).includes(v)) {
    return v as SuppliersSortParam;
  }
  return 'name_asc';
}

export function flattenSuppliersParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) {
    out[k] = Array.isArray(v) ? v[0] : v;
  }
  return out;
}

export function parseSuppliersUrlState(sp: Record<string, string | undefined>): SuppliersUrlState {
  const q = sp['q']?.trim() ?? '';
  const category = (sp['category'] ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',');
  const warehouse = sp['warehouse']?.trim() ?? '';
  const sort = parseSuppliersSort(sp['sort']);
  const page = parsePositiveInt(sp['page'], 1, 10_000);
  const pageSize = parsePositiveInt(sp['pageSize'], DEFAULT_PAGE_SIZE, 100);

  return { q, category, warehouse, sort, page, pageSize };
}

export function buildSuppliersApiQuery(state: SuppliersUrlState): URLSearchParams {
  const limit = state.pageSize;
  const offset = (state.page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    sort: state.sort,
  });
  if (state.q) {
    params.set('q', state.q);
  }
  if (state.category) {
    params.set('category', state.category);
  }
  if (state.warehouse) {
    params.set('warehouse', state.warehouse);
  }
  return params;
}

export function serializeSuppliersState(state: SuppliersUrlState): string {
  const p = new URLSearchParams();
  if (state.q) {
    p.set('q', state.q);
  }
  if (state.category) {
    p.set('category', state.category);
  }
  if (state.warehouse) {
    p.set('warehouse', state.warehouse);
  }
  if (state.sort !== 'name_asc') {
    p.set('sort', state.sort);
  }
  if (state.page > 1) {
    p.set('page', String(state.page));
  }
  if (state.pageSize !== DEFAULT_PAGE_SIZE) {
    p.set('pageSize', String(state.pageSize));
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function suppliersPath(state: SuppliersUrlState): string {
  return `/suppliers${serializeSuppliersState(state)}`;
}

/** Сброс фильтров (категория, страница); поисковая строка сохраняется. */
export function resetSuppliersFiltersKeepQuery(state: SuppliersUrlState): SuppliersUrlState {
  return {
    ...state,
    page: 1,
    category: '',
    warehouse: '',
  };
}

export function hasActiveSuppliersFilters(state: SuppliersUrlState): boolean {
  return (
    Boolean(state.category) ||
    Boolean(state.warehouse) ||
    state.sort !== 'name_asc' ||
    state.page > 1 ||
    state.pageSize !== DEFAULT_PAGE_SIZE
  );
}

/** Сброс списка: очистить поиск и фильтры, сортировка по умолчанию; размер страницы сохраняется. */
export function resetSuppliersList(state: SuppliersUrlState): SuppliersUrlState {
  return {
    ...state,
    q: '',
    category: '',
    warehouse: '',
    sort: 'name_asc',
    page: 1,
  };
}

export function toggleSuppliersSort(current: SuppliersSortParam): SuppliersSortParam {
  return current === 'name_asc' ? 'name_desc' : 'name_asc';
}
