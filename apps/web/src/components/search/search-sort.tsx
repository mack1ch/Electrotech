'use client';

import { CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { cn } from '@electrotech/ui';
import {
  SEARCH_SORT_VALUES,
  SORT_LABELS,
  type SearchSortParam,
  type SearchUrlState,
} from '@/lib/search/search-params';
import { searchPath } from '@/lib/search/search-params';

export function SearchSortControl({
  state,
  className,
}: {
  state: SearchUrlState;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <Select
        aria-label="Сортировка"
        variant="borderless"
        value={state.sort}
        popupMatchSelectWidth={false}
        options={SEARCH_SORT_VALUES.map((v) => ({ value: v, label: SORT_LABELS[v] }))}
        onChange={(v) => {
          router.push(searchPath({ ...state, sort: v as SearchSortParam, page: 1 }));
        }}
        suffixIcon={<CaretDownOutlined className="!text-[24px] !leading-none text-ink" />}
        className="!min-w-0 max-w-[min(100%,280px)] !text-base !font-normal !leading-normal !text-ink [&_.ant-select-arrow]:!h-6 [&_.ant-select-arrow]:!w-6 [&_.ant-select-arrow]:!flex [&_.ant-select-arrow]:!items-center [&_.ant-select-arrow]:!justify-end [&_.ant-select-selector]:!min-h-0 [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-0 [&_.ant-select-selector]:!py-0 [&_.ant-select-selector]:!shadow-none"
      />
    </div>
  );
}
