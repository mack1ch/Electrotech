'use client';

import { Checkbox, Form, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { LoaderCircle, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@electrotech/ui';
import { SEARCH_FILTER_CATEGORIES } from '@/lib/search/filter-categories';
import type { SearchUrlState } from '@/lib/search/search-params';
import { resetFiltersKeepQuery, searchPath } from '@/lib/search/search-params';

const CAT_ALL = '__all__';
const FILTER_DEBOUNCE_MS = 450;
const DEFAULT_PRICE_SLIDER_MAX = 99000;

type FilterFormValues = {
  category?: string;
};

function urlStateToFilterValues(state: SearchUrlState, priceSliderMax: number): FilterFormValues {
  void priceSliderMax;
  return {
    category: state.category || CAT_ALL,
  };
}

/** Ant Design getFieldsValue(true) отдаёт ключи со значением undefined — при spread они затирают поля из URL (например category). */
function pickDefinedFilterFields(values: Partial<FilterFormValues>): Partial<FilterFormValues> {
  const out: Partial<FilterFormValues> = {};
  for (const key of Object.keys(values) as (keyof FilterFormValues)[]) {
    const v = values[key];
    if (v !== undefined) {
      (out as Record<string, unknown>)[key as string] = v;
    }
  }
  return out;
}

function useDebouncedMergedFilterPush(
  compactForm: FormInstance<FilterFormValues> | null,
  fullForm: FormInstance<FilterFormValues> | null,
  state: SearchUrlState,
  delayMs: number,
  priceSliderMax: number,
) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const schedule = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      const base = stateRef.current;
      const merged: FilterFormValues = {
        ...urlStateToFilterValues(base, priceSliderMax),
        ...(fullForm ? pickDefinedFilterFields(fullForm.getFieldsValue(true)) : {}),
        ...(compactForm ? pickDefinedFilterFields(compactForm.getFieldsValue(true)) : {}),
      };
      router.push(searchPath(buildNextState(base, merged, priceSliderMax)));
    }, delayMs);
  }, [clearTimer, delayMs, compactForm, fullForm, router, priceSliderMax]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return schedule;
}

function buildNextState(base: SearchUrlState, v: FilterFormValues, priceSliderMax: number): SearchUrlState {
  void priceSliderMax;
  const category = v.category && v.category !== CAT_ALL ? v.category.trim() : '';

  return {
    ...base,
    page: 1,
    category,
    priceMin: '',
    priceMax: '',
    minStock: '',
    updatedFrom: '',
    availability: '',
    excludeOnRequest: false,
  };
}

const checkboxRowClass =
  'flex items-center gap-1.5 py-0.5 [&_.ant-checkbox]:items-start [&_.ant-checkbox-inner]:!h-4 [&_.ant-checkbox-inner]:!w-4 [&_.ant-checkbox-inner]:!rounded-[2.5px]';

const formLabelClassName =
  '[&_.ant-form-item-label>label]:!h-auto [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-base [&_.ant-form-item-label>label]:!text-ink';

function FilterFieldsManufacturer({
  form,
  schedulePush,
  itemClassName,
}: {
  form: FormInstance<FilterFormValues>;
  schedulePush: () => void;
  itemClassName: string;
}) {
  const category = Form.useWatch('category', form) ?? CAT_ALL;

  return (
    <Form.Item
      className={cn('!max-w-[275px]', itemClassName)}
      label={
        <div className="flex w-full max-w-[275px] items-center justify-between gap-2">
          <span>Производитель</span>
          <Typography.Link
            className="!p-0 !text-sm !font-normal !leading-6 !text-brand"
            onClick={(e) => {
              e.preventDefault();
              form.setFieldValue('category', CAT_ALL);
              schedulePush();
            }}
          >
            Все
          </Typography.Link>
        </div>
      }
    >
      <div className="mt-2 flex flex-col gap-2">
        {SEARCH_FILTER_CATEGORIES.map((c) => (
          <label key={c.slug} className={cn(checkboxRowClass, 'cursor-pointer')}>
            <Checkbox
              checked={category === c.slug}
              className="[&_.ant-checkbox-inner]:!rounded-[2.5px]"
              onChange={(e) => {
                form.setFieldValue('category', e.target.checked ? c.slug : CAT_ALL);
                schedulePush();
              }}
            />
            <span className="text-base font-normal text-ink">{c.label}</span>
          </label>
        ))}
      </div>
    </Form.Item>
  );
}

function FiltersFormCompact({
  form,
  schedulePush,
  priceSliderMax,
}: {
  form: FormInstance<FilterFormValues>;
  schedulePush: () => void;
  priceSliderMax: number;
}) {
  return (
    <Form<FilterFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      colon={false}
      onValuesChange={() => schedulePush()}
      className={formLabelClassName}
    >
      {priceSliderMax}
      <FilterFieldsManufacturer
        form={form}
        schedulePush={schedulePush}
        itemClassName="!mb-0"
      />
    </Form>
  );
}

/** Все поля фильтрации — для drawer «Все фильтры» (дублирует блоки с боковой панели + остальное). */
function FiltersFormFull({
  form,
  schedulePush,
  priceSliderMax,
}: {
  form: FormInstance<FilterFormValues>;
  schedulePush: () => void;
  priceSliderMax: number;
}) {
  return (
    <Form<FilterFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      colon={false}
      onValuesChange={() => schedulePush()}
      className={formLabelClassName}
    >
      {priceSliderMax}
      <FilterFieldsManufacturer form={form} schedulePush={schedulePush} itemClassName="!mb-0" />
    </Form>
  );
}

function SearchFiltersSidebarInner({
  state,
  embedded,
  priceSliderMax,
}: {
  state: SearchUrlState;
  embedded?: boolean;
  priceSliderMax: number;
}) {
  const [compactForm] = Form.useForm<FilterFormValues>();
  const [fullForm] = Form.useForm<FilterFormValues>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFiltersUpdating, setIsFiltersUpdating] = useState(false);
  /** Ant Design Drawer + Portal при forceRender даёт расхождение SSR/гидрации — монтируем только на клиенте. */
  const [drawerMounted, setDrawerMounted] = useState(false);
  const pathname = usePathname();
  const resetHref = searchPath(resetFiltersKeepQuery(state));
  const fk = serializeFilterKey(state);
  const schedulePush = useDebouncedMergedFilterPush(
    compactForm,
    fullForm,
    state,
    FILTER_DEBOUNCE_MS,
    priceSliderMax,
  );

  useEffect(() => {
    setDrawerMounted(true);
  }, []);

  useEffect(() => {
    setIsFiltersUpdating(false);
  }, [pathname]);

  const schedulePushWithStatus = useCallback(() => {
    if (isFiltersUpdating) {
      return;
    }
    setIsFiltersUpdating(true);
    schedulePush();
  }, [isFiltersUpdating, schedulePush]);

  useEffect(() => {
    const v = urlStateToFilterValues(state, priceSliderMax);
    fullForm.setFieldsValue(v);
    compactForm.setFieldsValue({
      priceMin: v.priceMin,
      priceMax: v.priceMax,
      excludeOnRequest: v.excludeOnRequest,
      availability: v.availability,
      minStock: v.minStock,
      category: v.category,
    });
  }, [fk, state, compactForm, fullForm, priceSliderMax]);

  return (
    <div
      className={cn(
        'flex max-h-[min(100dvh-4.5rem,940px)] flex-col bg-white px-[22px] pb-6 pt-6 shadow-sm',
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

      <div className="scrollbar-filters mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden pr-0.5">
        <FiltersFormCompact
          form={compactForm}
          schedulePush={schedulePushWithStatus}
          priceSliderMax={priceSliderMax}
        />
      </div>
      {drawerMounted}
    </div>
  );
}

/**
 * Только Drawer «Все фильтры» (как на /search) — для лендинга и других мест без боковой панели.
 * Пустой compactForm в merge не даёт лишних полей; базовое состояние приходит из пропа `state`.
 */
export function SearchAllFiltersDrawer({
  open,
  onClose,
  state,
  priceSliderMax,
}: {
  open: boolean;
  onClose: () => void;
  state: SearchUrlState;
  priceSliderMax: number;
}) {
  void open;
  void onClose;
  void state;
  void priceSliderMax;
  return null;
}

export function SearchFiltersSidebar({
  state,
  embedded,
  priceSliderMax = DEFAULT_PRICE_SLIDER_MAX,
}: {
  state: SearchUrlState;
  embedded?: boolean;
  /** Верхняя граница диапазона цен (из GET /product-price-filter-meta). */
  priceSliderMax?: number;
}) {
  const cap = priceSliderMax > 0 ? Math.floor(priceSliderMax) : DEFAULT_PRICE_SLIDER_MAX;

  if (embedded) {
    return <SearchFiltersSidebarInner state={state} embedded priceSliderMax={cap} />;
  }

  return (
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[260px] lg:self-start">
      <SearchFiltersSidebarInner state={state} priceSliderMax={cap} />
    </aside>
  );
}

function serializeFilterKey(state: SearchUrlState): string {
  return [
    state.q,
    state.supplier,
    state.sort,
    state.category,
    state.priceMin,
    state.priceMax,
    state.minStock,
    state.updatedFrom,
    state.availability,
    state.pageSize,
    state.excludeOnRequest ? '1' : '0',
  ].join('|');
}
