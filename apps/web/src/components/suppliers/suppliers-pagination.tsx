'use client';

import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import type { SuppliersUrlState } from '@/lib/suppliers/suppliers-params';
import { suppliersPath } from '@/lib/suppliers/suppliers-params';
import { useNavigationPending } from '@/lib/ui/use-navigation-pending';

export function SuppliersPagination({ state, total }: { state: SuppliersUrlState; total: number }) {
  const router = useRouter();
  const { runNavigation, isPending } = useNavigationPending();
  const paginationPending = isPending('suppliers-pagination');
  const pageSize = state.pageSize;

  if (total <= pageSize) {
    return null;
  }

  return (
    <div className="mt-4 flex justify-center lg:mt-6 lg:justify-end">
      <Pagination
        current={state.page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        pageSizeOptions={[10, 20, 50, 100]}
        showTotal={(t, range) => `${range[0]}-${range[1]} из ${t}`}
        onChange={(page, ps) => {
          runNavigation('suppliers-pagination', () => {
            router.push(
              suppliersPath({
                ...state,
                page,
                pageSize: ps ?? pageSize,
              }),
            );
          });
        }}
        disabled={paginationPending}
      />
    </div>
  );
}
