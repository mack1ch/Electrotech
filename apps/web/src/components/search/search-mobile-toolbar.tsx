'use client';

import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { ArrowDownAz, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SEARCH_SORT_VALUES,
  SORT_LABELS,
  type SearchSortParam,
  type SearchUrlState,
} from '@/lib/search/search-params';
import { searchPath } from '@/lib/search/search-params';

function isSortValue(v: string): v is SearchSortParam {
  return (SEARCH_SORT_VALUES as readonly string[]).includes(v);
}

/** Figma 0:2091 — горизонтальный ряд: сортировка, фильтры, чипы (12px #222, 36×36 кнопки, gap 4px). */
export function SearchMobileToolbar({ state }: { state: SearchUrlState }) {
  const router = useRouter();

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
                router.push(searchPath({ ...state, sort: key, page: 1 }));
              }
            },
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-none"
            aria-label="Сортировка"
            icon={<ArrowDownAz className="size-5 text-ink" strokeWidth={1.75} />}
          />
        </Dropdown>
        <a
          href="#search-filters"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink shadow-none"
          aria-label="Фильтры"
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
        </a>
        {(['Количество', 'Производитель', 'Поставщики'] as const).map((label) => (
          <a
            key={label}
            href="#search-filters"
            className="flex h-9 shrink-0 items-center rounded-lg bg-white px-3 text-xs font-normal leading-none text-[#222] shadow-none"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
