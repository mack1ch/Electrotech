import { fetchPublicApiJson } from '@/lib/api/public-api';
import type {
  ApiCategory,
  ApiManufacturerRef,
  ApiSupplierWarehouseCitiesResponse,
} from '@/lib/types/catalog';

export type CatalogFilterLists = {
  categories: ApiCategory[];
  manufacturers: ApiManufacturerRef[];
  warehouseCities: string[];
};

const empty: CatalogFilterLists = {
  categories: [],
  manufacturers: [],
  warehouseCities: [],
};

/** Данные для фильтров витрины: один запрос к публичному API со страницы (SSR). */
export async function loadCatalogFilterLists(): Promise<CatalogFilterLists> {
  try {
    const [categories, manufacturers, wh] = await Promise.all([
      fetchPublicApiJson<ApiCategory[]>('/categories'),
      fetchPublicApiJson<ApiManufacturerRef[]>('/manufacturers'),
      fetchPublicApiJson<ApiSupplierWarehouseCitiesResponse>('/supplier-warehouse-cities'),
    ]);
    return {
      categories,
      manufacturers,
      warehouseCities: Array.isArray(wh.cities) ? wh.cities : [],
    };
  } catch {
    return empty;
  }
}

export function rootCategoriesSorted(categories: ApiCategory[]): ApiCategory[] {
  return categories
    .filter((c) => !c.parentId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}
