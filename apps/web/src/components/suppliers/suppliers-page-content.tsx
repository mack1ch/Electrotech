import { Suspense } from 'react';
import { CatalogResultsAreaFallback } from '@/components/catalog/catalog-results-area-fallback';
import { SuppliersBreadcrumbs } from '@/components/suppliers/suppliers-breadcrumbs';
import { SuppliersFiltersSidebar } from '@/components/suppliers/suppliers-filters-sidebar';
import { SuppliersQueryBar } from '@/components/suppliers/suppliers-query-bar';
import { SuppliersResultsListBlock } from '@/components/suppliers/suppliers-results-list-block';
import { loadCatalogFilterLists, rootCategoriesSorted } from '@/lib/catalog/load-catalog-filter-options';
import { parseSuppliersUrlState, serializeSuppliersState } from '@/lib/suppliers/suppliers-params';

type SuppliersPageContentProps = {
  flatSearchParams: Record<string, string | undefined>;
};

/** Фильтры и шапка стабильны; список под отдельным Suspense при смене query. */
export async function SuppliersPageContent({ flatSearchParams }: SuppliersPageContentProps) {
  const state = parseSuppliersUrlState(flatSearchParams);
  const filterLists = await loadCatalogFilterLists();
  const supplierCategoryRoots = rootCategoriesSorted(filterLists.categories);

  return (
    <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-4 lg:px-9">
        <SuppliersFiltersSidebar
          state={state}
          categoryRoots={supplierCategoryRoots}
          warehouseCities={filterLists.warehouseCities}
        />

        <div className="min-w-0 w-full flex-1">
          <div className="flex flex-col gap-2 lg:gap-4">
            <div className="flex flex-col gap-1">
              <SuppliersBreadcrumbs />
              <h1 className="text-[18px] font-normal leading-normal text-ink lg:text-[21px] lg:leading-[32px]">
                Каталог поставщиков
              </h1>
            </div>

            <SuppliersQueryBar state={state} />
          </div>

          <Suspense
            key={serializeSuppliersState(state) || '_'}
            fallback={<CatalogResultsAreaFallback />}
          >
            <SuppliersResultsListBlock
              flatSearchParams={flatSearchParams}
              categoryRoots={supplierCategoryRoots}
              warehouseCities={filterLists.warehouseCities}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
