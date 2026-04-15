import { Suspense } from 'react';
import { CatalogResultsAreaFallback } from '@/components/catalog/catalog-results-area-fallback';
import { SearchBreadcrumbs } from '@/components/search/search-breadcrumbs';
import { SearchFiltersSidebar } from '@/components/search/search-filters-sidebar';
import { SearchQueryBar } from '@/components/search/search-query-bar';
import { SearchResultsProductBlock } from '@/components/search/search-results-product-block';
import { SearchSortControl } from '@/components/search/search-sort';
import { fetchPublicApiJson } from '@/lib/api/public-api';
import { loadCatalogFilterLists } from '@/lib/catalog/load-catalog-filter-options';
import { parseSearchUrlState, serializeSearchState } from '@/lib/search/search-params';
import type { ApiProductPriceFilterMeta } from '@/lib/types/catalog';

const DEFAULT_PRICE_SLIDER_MAX = 99000;

type SearchPageContentProps = {
  flatSearchParams: Record<string, string | undefined>;
};

/**
 * Оболочка страницы поиска: метаданные цен для слайдера + фильтры без пересоздания при смене выдачи.
 * Список товаров — во внутреннем Suspense с ключом по состоянию URL.
 */
export async function SearchPageContent({ flatSearchParams }: SearchPageContentProps) {
  const state = parseSearchUrlState(flatSearchParams);
  let priceSliderMax = DEFAULT_PRICE_SLIDER_MAX;
  const filterLists = await loadCatalogFilterLists();

  try {
    const meta = await fetchPublicApiJson<ApiProductPriceFilterMeta>('/product-price-filter-meta');
    const m = meta.priceMax;
    if (Number.isFinite(m) && m > 0) {
      priceSliderMax = Math.trunc(m);
    }
  } catch {
    // оставляем DEFAULT_PRICE_SLIDER_MAX
  }

  const query = state.q;

  return (
    <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-4 lg:px-9">
        <SearchFiltersSidebar state={state} priceSliderMax={priceSliderMax} filterLists={filterLists} />

        <div className="min-w-0 w-full flex-1">
          <div className="flex flex-col gap-2 lg:gap-1">
            <SearchBreadcrumbs />
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-normal leading-normal text-ink lg:text-[21px] lg:leading-[32px]">
                {query ? (
                  <>
                    Результаты поиска по запросу{' '}
                    <span className="font-semibold text-brand">
                      {'\u201c'}
                      {query}
                      {'\u201d'}
                    </span>
                  </>
                ) : (
                  <>Результаты поиска</>
                )}
              </h1>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <SearchQueryBar state={state} />
            <div className="hidden lg:block">
              <SearchSortControl state={state} />
            </div>
          </div>

          <Suspense
            key={serializeSearchState(state) || '_'}
            fallback={<CatalogResultsAreaFallback />}
          >
            <SearchResultsProductBlock
              flatSearchParams={flatSearchParams}
              priceSliderMax={priceSliderMax}
              filterLists={filterLists}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
