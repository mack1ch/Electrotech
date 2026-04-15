'use client';

import { Collapse } from 'antd';
import type { SuppliersUrlState } from '@/lib/suppliers/suppliers-params';
import { SuppliersFiltersSidebar } from '@/components/suppliers/suppliers-filters-sidebar';

export function SuppliersMobileFiltersCollapse({
  state,
  categoryRoots,
  warehouseCities,
}: {
  state: SuppliersUrlState;
  categoryRoots: Array<{ slug: string; name: string }>;
  warehouseCities: string[];
}) {
  return (
    <Collapse
      bordered={false}
      expandIconPlacement="end"
      className="mt-4 overflow-hidden rounded-[10px] border-0 bg-white shadow-none [&_.ant-collapse-item]:!border-neutral-100 [&_.ant-collapse-header]:!py-3"
      items={[
        {
          key: 'filters',
          label: <span className="text-base font-semibold leading-5 text-ink">Фильтры</span>,
          children: (
            <div className="-mx-4 -mb-4 border-t border-neutral-100">
              <SuppliersFiltersSidebar
                state={state}
                embedded
                categoryRoots={categoryRoots}
                warehouseCities={warehouseCities}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
