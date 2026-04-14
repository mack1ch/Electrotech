import { SuppliersBreadcrumbs } from '@/components/suppliers/suppliers-breadcrumbs';
import { SuppliersEmptyState } from '@/components/suppliers/suppliers-empty-state';
import { SuppliersFiltersSidebar } from '@/components/suppliers/suppliers-filters-sidebar';
import { SuppliersMobileFiltersCollapse } from '@/components/suppliers/suppliers-mobile-filters-collapse';
import { SuppliersMobileResults } from '@/components/suppliers/suppliers-mobile-results';
import { SuppliersMobileToolbar } from '@/components/suppliers/suppliers-mobile-toolbar';
import { SuppliersPagination } from '@/components/suppliers/suppliers-pagination';
import { SuppliersQueryBar } from '@/components/suppliers/suppliers-query-bar';
import { SuppliersResultsTable } from '@/components/suppliers/suppliers-results-table';
import { fetchPublicApiJson, PublicApiError } from '@/lib/api/public-api';
import { buildSuppliersApiQuery, parseSuppliersUrlState } from '@/lib/suppliers/suppliers-params';
import type { ApiSupplierListResponse } from '@/lib/types/catalog';

type SuppliersPageContentProps = {
  flatSearchParams: Record<string, string | undefined>;
};

export async function SuppliersPageContent({ flatSearchParams }: SuppliersPageContentProps) {
  const state = parseSuppliersUrlState(flatSearchParams);

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

  const query = state.q;

  return (
    <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-5 lg:px-9">
        <SuppliersFiltersSidebar state={state} />

        <div className="min-w-0 w-full flex-1">
          <div className="flex flex-col gap-2 lg:gap-4">
            <div className="flex flex-col gap-1">
              <SuppliersBreadcrumbs />
              <h1 className="text-[18px] font-normal leading-normal text-ink lg:text-[21px] lg:leading-[32px]">
                Каталог поставщиков
              </h1>
              <p className="min-h-6 text-xs leading-6 text-[#4a5565] lg:min-h-7 lg:text-sm lg:leading-6">
                {error ? (
                  <span className="text-red-600">{error}</span>
                ) : data ? (
                  <>Найдено поставщиков: {data.total}</>
                ) : (
                  '\u00a0'
                )}
              </p>
            </div>

            <SuppliersQueryBar state={state} />
          </div>

          {data && data.items.length > 0 ? <SuppliersMobileToolbar state={state} /> : null}

          <div className="mt-2">
            {error ? null : data && data.items.length > 0 ? (
              <>
                <SuppliersResultsTable items={data.items} state={state} />
                <SuppliersMobileResults items={data.items} />
                <div id="suppliers-filters" className="scroll-mt-28 lg:hidden">
                  <SuppliersMobileFiltersCollapse state={state} />
                </div>
                <SuppliersPagination state={state} total={data.total} />
              </>
            ) : data && data.items.length === 0 ? (
              <SuppliersEmptyState hasQuery={Boolean(query)} state={state} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
