'use client';

import { Button, Drawer, Select, Typography } from 'antd';
import { ChevronRight, MapPin, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@electrotech/ui';
import { SEARCH_FILTER_CATEGORIES } from '@/lib/search/filter-categories';
import { SUPPLIER_WAREHOUSE_CITIES } from '@/lib/suppliers/supplier-warehouse-cities';
import {
  resetSuppliersFiltersKeepQuery,
  suppliersPath,
  SUPPLIER_SORT_VALUES,
  SUPPLIERS_SORT_LABELS,
  type SuppliersSortParam,
  type SuppliersUrlState,
} from '@/lib/suppliers/suppliers-params';

const warehouseSelectOptions = [
  { value: '', label: 'Любое' },
  ...SUPPLIER_WAREHOUSE_CITIES.map((city) => ({ value: city, label: city })),
];

function warehouseFilterOption(input: string, option?: { label?: string; value?: string }) {
  const label = (option?.label ?? '').toString().toLocaleLowerCase('ru-RU');
  const q = input.trim().toLocaleLowerCase('ru-RU');
  return !q || label.includes(q);
}

function CategoryFilterBlock({
  state,
  onPickCategory,
}: {
  state: SuppliersUrlState;
  onPickCategory: (category: string) => void;
}) {
  const active = state.category;
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onPickCategory('')}
        className={cn(
          'flex w-full items-center rounded-[10px] px-4 py-3 text-left text-sm transition-colors',
          active === '' ? 'bg-[#e5efff] font-semibold text-brand' : 'font-normal text-ink hover:bg-neutral-50',
        )}
      >
        Все категории
      </button>
      {SEARCH_FILTER_CATEGORIES.map((c) => {
        const sel = active === c.slug;
        return (
          <button
            key={c.slug}
            type="button"
            onClick={() => onPickCategory(c.slug)}
            className={cn(
              'flex w-full items-start justify-between gap-2 rounded-[10px] px-4 py-3 text-left text-sm transition-colors',
              sel ? 'bg-[#e5efff] font-semibold text-brand' : 'font-normal text-ink hover:bg-neutral-50',
            )}
          >
            <span className="min-w-0 whitespace-normal leading-normal">{c.label}</span>
            <ChevronRight
              className={cn('mt-0.5 size-4 shrink-0', sel ? 'text-brand' : 'text-ink')}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

function WarehouseField({
  state,
  onChange,
  className,
}: {
  state: SuppliersUrlState;
  onChange: (warehouse: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-base font-semibold leading-normal text-ink">Расположение складов</div>
      <div className="relative flex h-[52px] items-center rounded bg-[#f9fafb] px-4">
        <Select
          aria-label="Расположение складов"
          variant="borderless"
          showSearch
          optionFilterProp="label"
          filterOption={warehouseFilterOption}
          popupMatchSelectWidth={false}
          listHeight={280}
          value={state.warehouse || ''}
          options={warehouseSelectOptions}
          onChange={(v) => onChange(typeof v === 'string' ? v : '')}
          className="w-full min-w-0 flex-1 [&_.ant-select-arrow]:!hidden [&_.ant-select-selection-item]:!text-base [&_.ant-select-selection-item]:!leading-6 [&_.ant-select-selection-placeholder]:!text-base [&_.ant-select-selection-placeholder]:!leading-6 [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-0 [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-placeholder]:!text-ink/40"
        />
        <MapPin className="pointer-events-none absolute right-4 top-1/2 size-6 shrink-0 -translate-y-1/2 text-ink" strokeWidth={1.75} aria-hidden />
      </div>
    </div>
  );
}

function SuppliersFiltersSidebarInner({
  state,
  embedded,
}: {
  state: SuppliersUrlState;
  embedded?: boolean;
}) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const resetHref = suppliersPath(resetSuppliersFiltersKeepQuery(state));

  useEffect(() => {
    setDrawerMounted(true);
  }, []);

  const push = (patch: Partial<SuppliersUrlState>) => {
    router.push(suppliersPath({ ...state, ...patch, page: 1 }));
  };

  return (
    <div
      className={cn(
        'flex max-h-[min(100dvh-4.5rem,940px)] flex-col bg-white px-[22px] pb-8 pt-6 shadow-sm',
        embedded && 'max-h-none rounded-none shadow-none',
        !embedded && 'rounded-[10px]',
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 py-1">
          <SlidersHorizontal className="size-6 shrink-0 text-ink" strokeWidth={1.75} aria-hidden />
          <Typography.Title level={5} className="!mb-0 !text-[18px] !font-semibold !leading-5 !text-ink">
            Фильтры
          </Typography.Title>
        </div>
        <Link href={resetHref} className="shrink-0 text-sm font-normal leading-normal text-brand hover:underline">
          Сбросить
        </Link>
      </div>

      <div className="scrollbar-filters mt-4 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto overflow-x-hidden pr-0.5">
        <CategoryFilterBlock state={state} onPickCategory={(category) => push({ category })} />

        <WarehouseField state={state} onChange={(warehouse) => push({ warehouse })} />

        <div className="max-w-[277px] shrink-0 pt-1">
          <Button
            type="default"
            size="large"
            block
            onClick={() => setDrawerOpen(true)}
            className="!h-[53px] !rounded-[4px] !border-0 !bg-brand-muted !px-12 !font-semibold !text-brand hover:!border-brand hover:!text-brand"
          >
            Все фильтры
          </Button>
        </div>
      </div>

      {drawerMounted ? (
        <Drawer
          title={
            <Typography.Title level={5} className="!mb-0 !text-lg !font-semibold !text-ink">
              Все фильтры
            </Typography.Title>
          }
          placement="left"
          size={360}
          open={drawerOpen}
          destroyOnClose={false}
          forceRender
          onClose={() => setDrawerOpen(false)}
          classNames={{ body: 'scrollbar-filters' }}
          styles={{
            body: { paddingTop: 16, paddingBottom: 24, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
          }}
        >
          <div className="flex flex-col gap-8">
            <div>
              <div className="mb-2 text-base font-semibold text-ink">Сортировка</div>
              <Select
                aria-label="Сортировка"
                className="!h-[50px] !w-full [&_.ant-select-selector]:!rounded-[4px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-[#f9fafb] [&_.ant-select-selector]:!px-3"
                value={state.sort}
                options={SUPPLIER_SORT_VALUES.map((v) => ({ value: v, label: SUPPLIERS_SORT_LABELS[v] }))}
                onChange={(v) => {
                  if ((SUPPLIER_SORT_VALUES as readonly string[]).includes(v as string)) {
                    push({ sort: v as SuppliersSortParam });
                  }
                }}
              />
            </div>
            <CategoryFilterBlock state={state} onPickCategory={(category) => push({ category })} />
            <WarehouseField state={state} onChange={(warehouse) => push({ warehouse })} />
          </div>
        </Drawer>
      ) : null}
    </div>
  );
}

export function SuppliersFiltersSidebar({
  state,
  embedded,
}: {
  state: SuppliersUrlState;
  embedded?: boolean;
}) {
  if (embedded) {
    return <SuppliersFiltersSidebarInner state={state} embedded />;
  }

  return (
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[321px] lg:self-start">
      <SuppliersFiltersSidebarInner state={state} />
    </aside>
  );
}
