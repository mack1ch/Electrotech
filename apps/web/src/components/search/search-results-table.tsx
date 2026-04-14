'use client';

import type { ReactNode } from 'react';
import { ArrowDownAz, ArrowUpZa } from 'lucide-react';
import Link from 'next/link';
import {
  displayArticle,
  formatStockUnits,
  formatTableDate,
  formatTablePriceRub,
  splitProductTitle,
} from '@/lib/format/search-table';
import type { SearchSortParam, SearchTableSortColumn, SearchUrlState } from '@/lib/search/search-params';
import { searchPath, toggleColumnSort } from '@/lib/search/search-params';
import type { ApiProduct } from '@/lib/types/catalog';

const SEARCH_TABLE_GRID_COLS = 'minmax(0,2.2fr) minmax(0,1.2fr) minmax(0,1fr) minmax(0,0.95fr) minmax(0,1.3fr) minmax(0,1fr)';

function sortDirection(sort: SearchSortParam, col: SearchTableSortColumn): 'asc' | 'desc' | null {
  const asc = `${col}_asc` as SearchSortParam;
  const desc = `${col}_desc` as SearchSortParam;
  if (sort === asc) {
    return 'asc';
  }
  if (sort === desc) {
    return 'desc';
  }
  return null;
}

function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  const stroke = 1.75;
  if (dir === 'asc') {
    return <ArrowDownAz className="size-4 shrink-0 text-brand" strokeWidth={stroke} aria-hidden />;
  }
  if (dir === 'desc') {
    return <ArrowUpZa className="size-4 shrink-0 text-brand" strokeWidth={stroke} aria-hidden />;
  }
  return <ArrowDownAz className="size-4 shrink-0 text-ink/45" strokeWidth={stroke} aria-hidden />;
}

function ThPlain({ children }: { children: ReactNode }) {
  return <span className="font-bold text-ink">{children}</span>;
}

function ThSortLink({
  state,
  column,
  label,
}: {
  state: SearchUrlState;
  column: SearchTableSortColumn;
  label: ReactNode;
}) {
  const nextSort = toggleColumnSort(state.sort, column);
  const href = searchPath({ ...state, sort: nextSort, page: 1 });
  const dir = sortDirection(state.sort, column);
  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center gap-1 font-bold text-ink hover:text-brand"
    >
      {label}
      <SortIcon dir={dir} />
    </Link>
  );
}

export function SearchResultsTable({
  items,
  state,
}: {
  items: ApiProduct[];
  state: SearchUrlState;
}) {
  return (
    <div className="hidden w-full overflow-x-auto rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:block">
      <div className="w-full min-w-[1003px] border-b border-[#e5e5e5] bg-white" role="rowgroup">
        <div
          className="grid h-[81px] w-full items-center text-base font-bold text-ink"
          style={{
            gridTemplateColumns: SEARCH_TABLE_GRID_COLS,
          }}
          role="row"
        >
          <div className="px-6" role="columnheader">
            <ThPlain>Наименование</ThPlain>
          </div>
          <div className="px-6" role="columnheader">
            <ThPlain>Производитель</ThPlain>
          </div>
          <div className="px-6" role="columnheader">
            <ThSortLink state={state} column="stock" label="Наличие" />
          </div>
          <div className="px-6" role="columnheader">
            <ThSortLink state={state} column="price" label="Цена" />
          </div>
          <div className="px-6" role="columnheader">
            <ThPlain>Поставщик</ThPlain>
          </div>
          <div className="px-8" role="columnheader">
            <ThSortLink state={state} column="updated" label="Дата обновления" />
          </div>
        </div>
      </div>
      <div className="w-full min-w-[1003px]" role="rowgroup">
        {items.map((p) => (
          <SearchTableRow key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function SearchTableRow({ product: p }: { product: ApiProduct }) {
  const lines = splitProductTitle(p.name);

  return (
    <div
      className="grid min-h-[81px] w-full items-center border-b border-[#e5e5e5] last:border-b-0"
      style={{
        gridTemplateColumns: SEARCH_TABLE_GRID_COLS,
      }}
      role="row"
    >
      <div className="px-6 py-4 text-base font-normal text-ink" role="cell">
        <Link href={`/product/${p.slug}`} className="block hover:text-brand">
          {lines ? (
            <>
              <span className="block leading-normal">{lines[0]}</span>
              <span className="block leading-normal">{lines[1]}</span>
            </>
          ) : (
            p.name
          )}
        </Link>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-[6px] border border-brand/45 bg-brand/5 px-2 py-0.5 text-xs font-semibold leading-normal text-brand">
            Арт.: {displayArticle(p)}
          </span>
        </div>
      </div>
      <div className="px-6 py-4 text-sm font-normal leading-normal text-[#4a5565]" role="cell">
        {p.category?.name ?? '—'}
      </div>
      <div className="px-6 py-4 text-sm font-normal leading-normal text-[#4a5565]" role="cell">
        {formatStockUnits(p.stockQuantity ?? 0)} шт
      </div>
      <div className="px-6 py-4 text-sm font-normal leading-normal text-[#4a5565]" role="cell">
        {formatTablePriceRub(p.price)}
      </div>
      <div className="px-6 py-4 text-sm font-normal leading-normal text-ink" role="cell">
        <Link
          href={`/suppliers/${p.supplier.slug}`}
          className="hover:text-brand hover:underline"
          prefetch={false}
        >
          {p.supplier.name}
        </Link>
      </div>
      <div className="px-8 py-4 text-sm text-[#4a5565]" role="cell">
        {formatTableDate(p.lastUpdatedAt ?? null)}
      </div>
    </div>
  );
}
