import { SuppliersEmptyState } from '@/components/suppliers/suppliers-empty-state';
import { SuppliersMobileFiltersCollapse } from '@/components/suppliers/suppliers-mobile-filters-collapse';
import { SuppliersMobileResults } from '@/components/suppliers/suppliers-mobile-results';
import { SuppliersMobileToolbar } from '@/components/suppliers/suppliers-mobile-toolbar';
import { SuppliersPagination } from '@/components/suppliers/suppliers-pagination';
import { SuppliersResultsTable } from '@/components/suppliers/suppliers-results-table';
import { fetchPublicApiJson, PublicApiError } from '@/lib/api/public-api';
import { buildSuppliersApiQuery, parseSuppliersUrlState } from '@/lib/suppliers/suppliers-params';
import type { ApiSupplierListResponse } from '@/lib/types/catalog';

type SuppliersResultsListBlockProps = {
  flatSearchParams: Record<string, string | undefined>;
  categoryRoots: Array<{ slug: string; name: string }>;
  warehouseCities: string[];
};

/** Список поставщиков и пагинация — отдельный Suspense, боковая панель фильтров не пересоздаётся. */
export async function SuppliersResultsListBlock({
  flatSearchParams,
  categoryRoots,
  warehouseCities,
}: SuppliersResultsListBlockProps) {
  const state = parseSuppliersUrlState(flatSearchParams);
  const query = state.q;

  let data: ApiSupplierListResponse | null = null;
  let error: string | null = null;

  const params = buildSuppliersApiQuery(state);

  try {
    data = await fetchPublicApiJson<ApiSupplierListResponse>(`/suppliers?${params.toString()}`);
  } catch (e) {
    if (e instanceof PublicApiError) {
      error =
        e.status == null
          ? 'API недоступен. Проверьте, что backend запущен (обычно http://localhost:4000).'
          : 'Сервис временно недоступен.';
    } else {
      error = 'Не удалось загрузить данные.';
    }
  }

  return (
    <>
      <p className="mt-2 min-h-6 text-xs leading-6 text-[#4a5565] lg:min-h-7 lg:text-sm lg:leading-6">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : data ? (
          <>Найдено поставщиков: {data.total}</>
        ) : (
          '\u00a0'
        )}
      </p>

      {data && data.items.length > 0 ? <SuppliersMobileToolbar state={state} /> : null}

      <div className="mt-2">
        {error ? null : data && data.items.length > 0 ? (
          <>
            <SuppliersResultsTable items={data.items} state={state} />
            <SuppliersMobileResults items={data.items} />
            <div id="suppliers-filters" className="scroll-mt-28 lg:hidden">
              <SuppliersMobileFiltersCollapse
                state={state}
                categoryRoots={categoryRoots}
                warehouseCities={warehouseCities}
              />
            </div>
            <SuppliersPagination state={state} total={data.total} />
          </>
        ) : data && data.items.length === 0 ? (
          <SuppliersEmptyState hasQuery={Boolean(query)} state={state} />
        ) : null}
      </div>
    </>
  );
}
