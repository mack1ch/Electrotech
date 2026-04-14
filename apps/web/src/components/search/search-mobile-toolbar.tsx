'use client';

import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { ArrowDownAz, LoaderCircle, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SEARCH_SORT_VALUES,
  SORT_LABELS,
  type SearchSortParam,
  type SearchUrlState,
} from '@/lib/search/search-params';
import { searchPath } from '@/lib/search/search-params';
import { useNavigationPending } from '@/lib/ui/use-navigation-pending';

function isSortValue(v: string): v is SearchSortParam {
  return (SEARCH_SORT_VALUES as readonly string[]).includes(v);
}

function openMobileFiltersOverlay() {
  window.dispatchEvent(new CustomEvent('search-mobile-filters:open'));
}

/** Figma 0:2091 — горизонтальный ряд: сортировка, фильтры, чипы (12px #222, 36×36 кнопки, gap 4px). */
export function SearchMobileToolbar({ state }: { state: SearchUrlState }) {
  const router = useRouter();
  const { runNavigation, isPending } = useNavigationPending();
  const sortPending = isPending('search-mobile-sort');

  const sortMenuItems: MenuProps['items'] = SEARCH_SORT_VALUES.map((v) => ({
    key: v,
    label: SORT_LABELS[v],
  }));

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-0 pt-0 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full flex-nowrap items-center gap-1">
        <Dropdown
          menu={{
            items: sortMenuItems,
            selectedKeys: [state.sort],
            onClick: ({ key }) => {
              if (isSortValue(key)) {
                runNavigation('search-mobile-sort', () => {
                  router.push(searchPath({ ...state, sort: key, page: 1 }));
                });
              }
            },
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-2 text-ink shadow-none transition-colors hover:bg-brand-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#dbe9ff]"
            aria-label="Сортировка"
            disabled={sortPending}
            icon={
              sortPending ? (
                <LoaderCircle className="size-5 animate-spin" strokeWidth={1.9} />
              ) : (
                <ArrowDownAz className="size-5" strokeWidth={1.75} />
              )
            }
          />
        </Dropdown>
        <button
          type="button"
          onClick={openMobileFiltersOverlay}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink shadow-none transition-colors hover:bg-brand-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#dbe9ff]"
          aria-label="Фильтры"
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
        </button>
        {(['Количество', 'Производитель', 'Поставщики'] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={openMobileFiltersOverlay}
            className="flex h-9 shrink-0 items-center rounded-lg bg-white px-3 text-xs font-normal leading-none text-[#222] shadow-none transition-colors hover:bg-brand-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#dbe9ff]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
