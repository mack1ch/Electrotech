import { Suspense } from 'react';
import { SearchLoadingFallback } from '@/components/search/search-loading-fallback';
import { SearchPageContent } from '@/components/search/search-page-content';
import { flattenSearchParams } from '@/lib/search/search-params';

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage(props: SearchPageProps) {
  const raw = await props.searchParams;
  const flat = flattenSearchParams(raw);

  return (
    <Suspense fallback={<SearchLoadingFallback />}>
      <SearchPageContent flatSearchParams={flat} />
    </Suspense>
  );
}
