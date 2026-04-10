import { Suspense } from 'react';
import { SearchLoadingFallback } from '@/components/search/search-loading-fallback';
import { SuppliersPageContent } from '@/components/suppliers/suppliers-page-content';
import {
  flattenSuppliersParams,
  parseSuppliersUrlState,
  serializeSuppliersState,
} from '@/lib/suppliers/suppliers-params';

type SuppliersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuppliersPage(props: SuppliersPageProps) {
  const raw = await props.searchParams;
  const flat = flattenSuppliersParams(raw);
  const state = parseSuppliersUrlState(flat);
  const suspenseKey = serializeSuppliersState(state) || '_';

  return (
    <Suspense key={suspenseKey} fallback={<SearchLoadingFallback />}>
      <SuppliersPageContent flatSearchParams={flat} />
    </Suspense>
  );
}
