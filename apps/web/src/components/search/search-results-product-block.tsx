import { SearchEmptyState } from '@/components/search/search-empty-state';
import { SearchMobileFiltersCollapse } from '@/components/search/search-mobile-filters-collapse';
import { SearchMobileResults } from '@/components/search/search-mobile-results';
import { SearchMobileToolbar } from '@/components/search/search-mobile-toolbar';
import { SearchPagination } from '@/components/search/search-pagination';
import { SearchResultsTable } from '@/components/search/search-results-table';
import { fetchPublicApiJson, PublicApiError } from '@/lib/api/public-api';
import { buildProductsApiQuery, parseSearchUrlState } from '@/lib/search/search-params';
import type { ApiProductListResponse } from '@/lib/types/catalog';

type SearchResultsProductBlockProps = {
  flatSearchParams: Record<string, string | undefined>;
  priceSliderMax: number;
};

/** Только выдача и пагинация — подвешивается отдельным Suspense, чтобы фильтры не размонтировались. */
export async function SearchResultsProductBlock({
  flatSearchParams,
  priceSliderMax,
}: SearchResultsProductBlockProps) {
  const state = parseSearchUrlState(flatSearchParams);
  const query = state.q;

  let data: ApiProductListResponse | null = null;
  let error: string | null = null;

  const params = buildProductsApiQuery(state);

  try {
    data = await fetchPublicApiJson<ApiProductListResponse>(`/products?${params.toString()}`);
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
      <p className="mt-2 text-xs leading-5 text-[#4a5565] lg:text-sm lg:leading-6">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : data ? (
          query ? (
            <>Найдено товаров: {data.total}</>
          ) : (
            <>
              Показано товаров: {data.total}. Уточните запрос в поле ниже, чтобы сузить выбор.
            </>
          )
        ) : null}
      </p>

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
    </>
  );
}
