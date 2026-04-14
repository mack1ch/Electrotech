/** Параметры страницы поиска в URL (сервер + клиент). */

/** Допустимые варианты сортировки (колонки таблицы: цена, наличие, последнее обновление). */
export const SEARCH_SORT_VALUES = [
  'price_asc',
  'price_desc',
  'stock_asc',
  'stock_desc',
  'updated_asc',
  'updated_desc',
] as const;

export type SearchSortParam = (typeof SEARCH_SORT_VALUES)[number];

export const SORT_LABELS: Record<SearchSortParam, string> = {
  price_asc: 'Цена: сначала дешевле',
  price_desc: 'Цена: сначала дороже',
  stock_asc: 'Наличие: меньше → больше',
  stock_desc: 'Наличие: больше → меньше',
  updated_asc: 'Обновление: старые сначала',
  updated_desc: 'Обновление: новые сначала',
};

export const DEFAULT_PAGE_SIZE = 20;

export type SearchUrlState = {
  q: string;
  supplier: string;
  sort: SearchSortParam;
  page: number;
  pageSize: number;
  category: string;
  priceMin: string;
  priceMax: string;
  minStock: string;
  updatedFrom: string;
  availability: string;
  /** Скрывать в выдаче позиции с ценой «По запросу». */
  excludeOnRequest: boolean;
};

export function parseSearchSort(v: string | undefined): SearchSortParam {
  if (v && (SEARCH_SORT_VALUES as readonly string[]).includes(v)) {
    return v as SearchSortParam;
  }
  return 'price_asc';
}

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

export function flattenSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) {
    out[k] = Array.isArray(v) ? v[0] : v;
  }
  return out;
}

export function parseSearchUrlState(sp: Record<string, string | undefined>): SearchUrlState {
  const q = sp['q']?.trim() ?? '';
  const supplier = sp['supplier']?.trim() ?? '';
  const sort = parseSearchSort(sp['sort']);
  const page = parsePositiveInt(sp['page'], 1, 10_000);
  const pageSize = parsePositiveInt(sp['pageSize'], DEFAULT_PAGE_SIZE, 100);
  const category = sp['category']?.trim() ?? '';
  const priceMin = sp['priceMin']?.trim() ?? '';
  const priceMax = sp['priceMax']?.trim() ?? '';
  const minStock = sp['minStock']?.trim() ?? '';
  const updatedFrom = sp['updatedFrom']?.trim() ?? '';
  const rawAvail = sp['availability']?.trim() ?? '';
  const availability =
    rawAvail === 'in_stock' || rawAvail === 'on_order' || rawAvail === 'expected' ? rawAvail : '';
  const exclRaw = sp['excludeOnRequest']?.trim().toLowerCase() ?? '';
  const excludeOnRequest = exclRaw === '1' || exclRaw === 'true';

  return {
    q,
    supplier,
    sort,
    page,
    pageSize,
    category,
    priceMin,
    priceMax,
    minStock,
    updatedFrom,
    availability,
    excludeOnRequest,
  };
}

export function buildProductsApiQuery(state: SearchUrlState): URLSearchParams {
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
  if (state.supplier) {
    params.set('supplier', state.supplier);
  }
  if (state.category) {
    params.set('category', state.category);
  }
  if (state.priceMin !== '' && !Number.isNaN(Number.parseFloat(state.priceMin))) {
    params.set('priceMin', state.priceMin);
  }
  if (state.priceMax !== '' && !Number.isNaN(Number.parseFloat(state.priceMax))) {
    params.set('priceMax', state.priceMax);
  }
  if (state.minStock !== '' && !Number.isNaN(Number.parseInt(state.minStock, 10))) {
    params.set('minStock', state.minStock);
  }
  if (state.updatedFrom) {
    params.set('updatedFrom', state.updatedFrom);
  }
  if (state.availability === 'in_stock' || state.availability === 'on_order' || state.availability === 'expected') {
    params.set('availability', state.availability);
  }
  if (state.excludeOnRequest) {
    params.set('excludeOnRequest', '1');
  }
  return params;
}

/** Сериализация состояния в query-string для Link / router (только заданные поля). */
export function serializeSearchState(state: SearchUrlState): string {
  const p = new URLSearchParams();
  if (state.q) {
    p.set('q', state.q);
  }
  if (state.supplier) {
    p.set('supplier', state.supplier);
  }
  if (state.sort !== 'price_asc') {
    p.set('sort', state.sort);
  }
  if (state.page > 1) {
    p.set('page', String(state.page));
  }
  if (state.pageSize !== DEFAULT_PAGE_SIZE) {
    p.set('pageSize', String(state.pageSize));
  }
  if (state.category) {
    p.set('category', state.category);
  }
  if (state.priceMin) {
    p.set('priceMin', state.priceMin);
  }
  if (state.priceMax) {
    p.set('priceMax', state.priceMax);
  }
  if (state.minStock) {
    p.set('minStock', state.minStock);
  }
  if (state.updatedFrom) {
    p.set('updatedFrom', state.updatedFrom);
  }
  if (state.availability) {
    p.set('availability', state.availability);
  }
  if (state.excludeOnRequest) {
    p.set('excludeOnRequest', '1');
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function searchPath(state: SearchUrlState): string {
  return `/search${serializeSearchState(state)}`;
}

/** Сброс фильтров, запрос и сортировка сохраняются. */
export function resetFiltersKeepQuery(state: SearchUrlState): SearchUrlState {
  return {
    ...state,
    page: 1,
    supplier: '',
    category: '',
    priceMin: '',
    priceMax: '',
    minStock: '',
    updatedFrom: '',
    availability: '',
    excludeOnRequest: false,
  };
}

/** Сброс фильтров и строки поиска `q`; сортировка и размер страницы сохраняются. */
export function resetFiltersAndQuery(state: SearchUrlState): SearchUrlState {
  return {
    ...resetFiltersKeepQuery(state),
    q: '',
  };
}

/** Есть ли в URL активные ограничения по каталогу (не текстовый запрос). */
export function hasActiveSearchFilters(state: SearchUrlState): boolean {
  return (
    Boolean(state.category) ||
    Boolean(state.supplier) ||
    state.priceMin !== '' ||
    state.priceMax !== '' ||
    state.minStock !== '' ||
    state.updatedFrom !== '' ||
    Boolean(state.availability) ||
    state.excludeOnRequest
  );
}

export type SearchTableSortColumn = 'price' | 'stock' | 'updated';

/** Переключение сортировки по колонке таблицы (asc ↔ desc). */
export function toggleColumnSort(current: SearchSortParam, column: SearchTableSortColumn): SearchSortParam {
  const asc = `${column}_asc` as SearchSortParam;
  const desc = `${column}_desc` as SearchSortParam;
  if (current === asc) {
    return desc;
  }
  if (current === desc) {
    return asc;
  }
  return asc;
}
