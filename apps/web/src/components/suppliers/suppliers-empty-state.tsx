'use client';

import { Button, Empty } from 'antd';
import Link from 'next/link';
import {
  hasActiveSuppliersFilters,
  resetSuppliersList,
  suppliersPath,
  type SuppliersUrlState,
} from '@/lib/suppliers/suppliers-params';

export function SuppliersEmptyState({
  hasQuery,
  state,
}: {
  hasQuery: boolean;
  state: SuppliersUrlState;
}) {
  const showReset = hasQuery || hasActiveSuppliersFilters(state);

  return (
    <Empty
      className="rounded-lg bg-white py-10 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      description={
        hasQuery || hasActiveSuppliersFilters(state)
          ? 'Поставщики не найдены.'
          : 'В каталоге пока нет поставщиков.'
      }
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
      {showReset ? (
        <Link href={suppliersPath(resetSuppliersList(state))} prefetch={false} className="mt-4 inline-block">
          <Button type="primary" size="large">
            Сбросить фильтр
          </Button>
        </Link>
      ) : null}
    </Empty>
  );
}
