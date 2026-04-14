'use client';

import type { ReactNode } from 'react';
import { ArrowDownAz, ArrowUpZa, Calendar, Package } from 'lucide-react';
import Link from 'next/link';
import {
  displayArticle,
  formatStockUnits,
  formatTableDate,
  formatTablePriceRub,
  mobileAvailabilityUnit,
} from '@/lib/format/search-table';
import type { SearchSortParam, SearchTableSortColumn, SearchUrlState } from '@/lib/search/search-params';
import { searchPath, toggleColumnSort } from '@/lib/search/search-params';
import type { ApiProduct } from '@/lib/types/catalog';

/** Порядок: Наименование+артикул, Производитель, Наличие, Цена, Поставщик, Дата обновления. */
const SEARCH_TABLE_GRID_COLS = 'minmax(0,245fr) minmax(0,170fr) minmax(0,145fr) minmax(0,125fr) minmax(0,190fr) minmax(0,160fr)';

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
          className="grid h-[72px] w-full items-center text-base font-bold text-ink"
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
          <div className="px-6" role="columnheader">
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
          <span className="block leading-normal">{p.name}</span>
        </Link>
        <p className="mt-1 text-sm text-[#6a7282]">
          арт. {displayArticle(p)}
        </p>
      </div>
      <div className="px-6 py-4 text-sm font-normal text-[#4a5565]" role="cell">
        {p.category?.name ?? '—'}
      </div>
      <div className="px-6 py-4" role="cell">
        <span className="inline-flex items-center gap-1 text-sm text-[#4a5565]">
          <Package className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          {formatStockUnits(p.stockQuantity ?? 0)} {mobileAvailabilityUnit(p)}
        </span>
      </div>
      <div className="px-6 py-4 text-sm font-normal text-[#4a5565]" role="cell">
        {formatTablePriceRub(p.price)}
      </div>
      <div className="px-6 py-4 text-base font-normal text-ink" role="cell">
        <Link
          href={`/suppliers/${p.supplier.slug}`}
          className="hover:text-brand hover:underline"
          prefetch={false}
        >
          {p.supplier.name}
        </Link>
      </div>
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-[#4a5565]" role="cell">
        <Calendar className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        {formatTableDate(p.lastUpdatedAt ?? null)}
      </div>
    </div>
  );
}
