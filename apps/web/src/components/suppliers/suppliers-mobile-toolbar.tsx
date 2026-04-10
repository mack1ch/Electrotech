'use client';

import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { ArrowDownAz, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SUPPLIER_SORT_VALUES,
  SUPPLIERS_SORT_LABELS,
  suppliersPath,
  type SuppliersSortParam,
  type SuppliersUrlState,
} from '@/lib/suppliers/suppliers-params';

function isSortValue(v: string): v is SuppliersSortParam {
  return (SUPPLIER_SORT_VALUES as readonly string[]).includes(v);
}

export function SuppliersMobileToolbar({ state }: { state: SuppliersUrlState }) {
  const router = useRouter();

  const sortMenuItems: MenuProps['items'] = SUPPLIER_SORT_VALUES.map((v) => ({
    key: v,
    label: SUPPLIERS_SORT_LABELS[v],
  }));

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 pt-0 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full flex-nowrap items-center gap-1">
        <Dropdown
          menu={{
            items: sortMenuItems,
            selectedKeys: [state.sort],
            onClick: ({ key }) => {
              if (isSortValue(key)) {
                router.push(suppliersPath({ ...state, sort: key, page: 1 }));
              }
            },
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-none"
            aria-label="Сортировка"
            icon={<ArrowDownAz className="size-5 text-ink" strokeWidth={1.75} />}
          />
        </Dropdown>
        <a
          href="#suppliers-filters"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-2 text-ink shadow-none"
          aria-label="Фильтры"
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
        </a>
        {(['Количество', 'Производитель', 'Поставщики'] as const).map((label) => (
          <span
            key={label}
            className="inline-flex h-9 shrink-0 items-center rounded-lg bg-white px-3 py-2 text-xs font-normal leading-normal text-[#222]"
            aria-hidden
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
