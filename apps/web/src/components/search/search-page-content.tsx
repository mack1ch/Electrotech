import { SearchBreadcrumbs } from '@/components/search/search-breadcrumbs';
import { SearchEmptyState } from '@/components/search/search-empty-state';
import { SearchFiltersSidebar } from '@/components/search/search-filters-sidebar';
import { SearchMobileFiltersCollapse } from '@/components/search/search-mobile-filters-collapse';
import { SearchMobileResults } from '@/components/search/search-mobile-results';
import { SearchMobileToolbar } from '@/components/search/search-mobile-toolbar';
import { SearchPagination } from '@/components/search/search-pagination';
import { SearchQueryBar } from '@/components/search/search-query-bar';
import { SearchResultsTable } from '@/components/search/search-results-table';
import { SearchSortControl } from '@/components/search/search-sort';
import { fetchPublicApiJson, PublicApiError } from '@/lib/api/public-api';
import {
  buildProductsApiQuery,
  parseSearchUrlState,
} from '@/lib/search/search-params';
import type { ApiProductListResponse, ApiProductPriceFilterMeta } from '@/lib/types/catalog';

const DEFAULT_PRICE_SLIDER_MAX = 99000;

type SearchPageContentProps = {
  flatSearchParams: Record<string, string | undefined>;
};

/** Асинхронная выдача: при смене query Suspense показывает fallback, пока идут запросы к API. */
export async function SearchPageContent({ flatSearchParams }: SearchPageContentProps) {
  const state = parseSearchUrlState(flatSearchParams);

  let data: ApiProductListResponse | null = null;
  let error: string | null = null;
  let priceSliderMax = DEFAULT_PRICE_SLIDER_MAX;

  const params = buildProductsApiQuery(state);
  const [listResult, metaResult] = await Promise.allSettled([
    fetchPublicApiJson<ApiProductListResponse>(`/products?${params.toString()}`),
    fetchPublicApiJson<ApiProductPriceFilterMeta>('/product-price-filter-meta'),
  ]);

  if (listResult.status === 'fulfilled') {
    data = listResult.value;
  } else {
    const e = listResult.reason;
    if (e instanceof PublicApiError) {
      error =
        e.status == null
          ? 'API недоступен. Проверьте, что backend запущен (обычно http://localhost:4000).'
          : 'Сервис временно недоступен.';
    } else {
      error = 'Не удалось загрузить данные.';
    }
  }

  if (metaResult.status === 'fulfilled') {
    const m = metaResult.value.priceMax;
    if (Number.isFinite(m) && m > 0) {
      priceSliderMax = Math.trunc(m);
    }
  }

  const query = state.q;

  return (
    <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-4 lg:px-9">
        <SearchFiltersSidebar state={state} priceSliderMax={priceSliderMax} />

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
              <p className="text-xs leading-5 text-[#4a5565] lg:text-sm lg:leading-6">
                {error ? (
                  <span className="text-red-600">{error}</span>
                ) : data ? (
                  query ? (
                    <>Найдено товаров: {data.total}</>
                  ) : (
                    <>
                      Показано товаров: {data.total}. Уточните запрос в поле ниже, чтобы сузить
                      выбор.
                    </>
                  )
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <SearchQueryBar state={state} />
            <div className="hidden lg:block">
              <SearchSortControl state={state} />
            </div>
          </div>

          {data && data.items.length > 0 ? <SearchMobileToolbar state={state} /> : null}

          <div className="mt-2 lg:mt-6">
            {error ? null : data && data.items.length > 0 ? (
              <>
                <SearchResultsTable items={data.items} state={state} />
                <SearchMobileResults items={data.items} />
                <div id="search-filters" className="scroll-mt-28 lg:hidden">
                  <SearchMobileFiltersCollapse state={state} priceSliderMax={priceSliderMax} />
                </div>
                <SearchPagination state={state} total={data.total} />
              </>
            ) : data && data.items.length === 0 ? (
              <SearchEmptyState hasQuery={Boolean(query)} state={state} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
