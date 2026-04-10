import { Suspense } from 'react';
import { SearchLoadingFallback } from '@/components/search/search-loading-fallback';
import { SearchPageContent } from '@/components/search/search-page-content';
import { flattenSearchParams, parseSearchUrlState, serializeSearchState } from '@/lib/search/search-params';

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage(props: SearchPageProps) {
  const raw = await props.searchParams;
  const flat = flattenSearchParams(raw);
  const state = parseSearchUrlState(flat);
  const suspenseKey = serializeSearchState(state) || '_';

  return (
    <Suspense key={suspenseKey} fallback={<SearchLoadingFallback />}>
      <SearchPageContent flatSearchParams={flat} />
    </Suspense>
  );
}
