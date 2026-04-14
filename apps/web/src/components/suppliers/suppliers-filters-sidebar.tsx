'use client';

import { Button, Drawer, Select, Typography } from 'antd';
import { ChevronRight, LoaderCircle, MapPin, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@electrotech/ui';
import { SUPPLIER_WAREHOUSE_CITIES } from '@/lib/suppliers/supplier-warehouse-cities';
import {
  resetSuppliersFiltersKeepQuery,
  suppliersPath,
  SUPPLIER_SORT_VALUES,
  SUPPLIERS_SORT_LABELS,
  type SuppliersSortParam,
  type SuppliersUrlState,
} from '@/lib/suppliers/suppliers-params';
import { useNavigationPending } from '@/lib/ui/use-navigation-pending';

type SupplierFilterCategoryNode = {
  slug: string;
  label: string;
  children?: Array<{ slug: string; label: string }>;
};

const SUPPLIER_FILTER_CATEGORIES: SupplierFilterCategoryNode[] = [
  {
    slug: 'cable',
    label: 'Кабель и провод',
    children: [
      { slug: 'cable', label: 'Силовые кабели' },
      { slug: 'cable', label: 'Контрольные кабели' },
      { slug: 'cable', label: 'Монтажные провода' },
    ],
  },
  {
    slug: 'equipment',
    label: 'Электрооборудование',
    children: [
      { slug: 'equipment', label: 'Автоматика' },
      { slug: 'equipment', label: 'Щитовое оборудование' },
    ],
  },
  {
    slug: 'switchgear',
    label: 'Распределительные устройства',
    children: [
      { slug: 'switchgear', label: 'Щиты ГРЩ' },
      { slug: 'switchgear', label: 'Щиты ВРУ' },
    ],
  },
  {
    slug: 'lighting',
    label: 'Светотехника',
  },
];

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
  onPickCategory: (category: string[]) => void;
}) {
  const activeSet = new Set(
    state.category
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SUPPLIER_FILTER_CATEGORIES.map((category) => [category.slug, false])),
  );

  useEffect(() => {
    const selected = new Set(
      state.category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    );
    if (selected.size === 0) {
      return;
    }
    const matched = SUPPLIER_FILTER_CATEGORIES.find(
      (category) =>
        selected.has(category.slug) || category.children?.some((child) => selected.has(child.slug)),
    );
    if (matched) {
      setExpanded((prev) => ({ ...prev, [matched.slug]: true }));
    }
  }, [state.category]);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onPickCategory([])}
        className={cn(
          'flex w-full items-center rounded-[10px] px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1',
          activeSet.size === 0
            ? 'bg-[#e5efff] font-semibold text-brand'
            : 'font-normal text-ink hover:bg-neutral-50',
        )}
      >
        Все категории
      </button>
      {SUPPLIER_FILTER_CATEGORIES.map((c) => {
        const hasChildren = Boolean(c.children?.length);
        const isExpanded = expanded[c.slug] ?? false;
        const sel = activeSet.has(c.slug);
        return (
          <div key={c.slug} className="rounded-[10px]">
            <button
              type="button"
              onClick={() => {
                const next = new Set(activeSet);
                if (next.has(c.slug)) {
                  next.delete(c.slug);
                } else {
                  next.add(c.slug);
                }
                onPickCategory(Array.from(next));
                if (hasChildren) {
                  setExpanded((prev) => ({ ...prev, [c.slug]: !isExpanded }));
                }
              }}
              className={cn(
                'flex w-full items-start justify-between gap-2 rounded-[10px] px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1',
                sel ? 'bg-[#e5efff] font-semibold text-brand' : 'font-normal text-ink hover:bg-neutral-50',
              )}
            >
              <span className="min-w-0 whitespace-normal leading-normal">{c.label}</span>
              {hasChildren ? (
                <ChevronRight
                  className={cn(
                    'mt-0.5 size-4 shrink-0 transition-transform',
                    isExpanded ? 'rotate-90' : 'rotate-0',
                    sel ? 'text-brand' : 'text-ink',
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
              ) : null}
            </button>
            {hasChildren && isExpanded ? (
              <div className="flex flex-col gap-1 px-2 pb-2">
                {c.children!.map((child) => {
                  const childSel = activeSet.has(child.slug);
                  return (
                    <button
                      key={`${c.slug}-${child.label}`}
                      type="button"
                      onClick={() => {
                        const next = new Set(activeSet);
                        if (next.has(child.slug)) {
                          next.delete(child.slug);
                        } else {
                          next.add(child.slug);
                        }
                        onPickCategory(Array.from(next));
                      }}
                      className={cn(
                        'w-full rounded-[8px] px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1',
                        childSel
                          ? 'bg-[#e5efff] font-semibold text-brand'
                          : 'text-ink-secondary hover:bg-neutral-50',
                      )}
                    >
                      {child.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
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
          suffixIcon={null}
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
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [isFiltersUpdating, setIsFiltersUpdating] = useState(false);
  const { runNavigation } = useNavigationPending();
  const resetHref = suppliersPath(resetSuppliersFiltersKeepQuery(state));

  useEffect(() => {
    setDrawerMounted(true);
  }, []);

  useEffect(() => {
    setIsFiltersUpdating(false);
  }, [pathname, state.category, state.warehouse, state.sort, state.page, state.pageSize, state.q]);

  const push = (patch: Partial<SuppliersUrlState>) => {
    if (isFiltersUpdating) {
      return;
    }
    setIsFiltersUpdating(true);
    runNavigation('suppliers-filters-update', () => {
      router.push(suppliersPath({ ...state, ...patch, page: 1 }));
    });
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
        <Link
          href={resetHref}
          className="shrink-0 text-sm font-normal leading-normal text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1"
        >
          Сбросить
        </Link>
      </div>
      {isFiltersUpdating ? (
        <div className="mt-3 inline-flex items-center gap-2 text-xs text-ink-secondary" aria-live="polite">
          <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} aria-hidden />
          Обновляем результаты...
        </div>
      ) : null}

      <div className="scrollbar-filters mt-4 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto overflow-x-hidden pr-0.5">
        <CategoryFilterBlock
          state={state}
          onPickCategory={(categories) => push({ category: categories.join(',') })}
        />

        <WarehouseField state={state} onChange={(warehouse) => push({ warehouse })} />

        <div className="max-w-[277px] shrink-0 pt-1">
          <Button
            type="default"
            size="large"
            block
            onClick={() => setDrawerOpen(true)}
            className="!h-[53px] !rounded-[4px] !border-0 !bg-brand-muted !px-12 !font-semibold !text-brand transition-colors hover:!border-brand hover:!text-brand focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-brand/35 focus-visible:!ring-offset-1 active:!bg-[#dbe9ff]"
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
            <CategoryFilterBlock
              state={state}
              onPickCategory={(categories) => push({ category: categories.join(',') })}
            />
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
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[281px] lg:self-start">
      <SuppliersFiltersSidebarInner state={state} />
    </aside>
  );
}
