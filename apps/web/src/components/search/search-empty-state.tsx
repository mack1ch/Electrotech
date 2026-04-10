'use client';

import { Button, Empty } from 'antd';
import Link from 'next/link';
import type { SearchUrlState } from '@/lib/search/search-params';
import { hasActiveSearchFilters, resetFiltersAndQuery, searchPath } from '@/lib/search/search-params';

export function SearchEmptyState({
  hasQuery,
  state,
}: {
  hasQuery: boolean;
  state: SearchUrlState;
}) {
  const resetHref = searchPath(resetFiltersAndQuery(state));
  const showResetFilters =
    hasActiveSearchFilters(state) || state.page > 1 || Boolean(state.q.trim());

  return (
    <Empty
      className="rounded-lg bg-white py-10 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      description={hasQuery ? 'По запросу ничего не найдено.' : 'Товары не найдены.'}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
      {showResetFilters ? (
        <Link href={resetHref} prefetch={false} className="mt-4 inline-block">
          <Button type="primary" size="large">
            Сбросить фильтр
          </Button>
        </Link>
      ) : null}
    </Empty>
  );
}
