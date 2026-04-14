'use client';

import {
  Button,
  Drawer,
  Form,
  InputNumber,
  Select,
  Slider,
  Typography,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import { LoaderCircle, MapPin, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@electrotech/ui';
import { SEARCH_FILTER_CATEGORIES } from '@/lib/search/filter-categories';
import type { SearchUrlState } from '@/lib/search/search-params';
import { resetFiltersKeepQuery, searchPath } from '@/lib/search/search-params';
import { SUPPLIER_WAREHOUSE_CITIES } from '@/lib/suppliers/supplier-warehouse-cities';

const CAT_ALL = '__all__';
const FILTER_DEBOUNCE_MS = 450;
const DEFAULT_PRICE_SLIDER_MAX = 99000;

type FilterFormValues = {
  priceMin?: number | null;
  priceMax?: number | null;
  category?: string;
  supplierCity?: string;
};

function urlStateToFilterValues(state: SearchUrlState, priceSliderMax: number): FilterFormValues {
  return {
    priceMin: toPriceMin(state),
    priceMax: toPriceMax(state, priceSliderMax),
    category: state.category || CAT_ALL,
    supplierCity: state.supplierCity || '',
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

function toPriceMin(state: SearchUrlState): number {
  if (state.priceMin === '') {
    return 0;
  }
  const n = Number.parseFloat(state.priceMin);
  return Number.isNaN(n) ? 0 : n;
}

function toPriceMax(state: SearchUrlState, priceSliderMax: number): number {
  if (state.priceMax === '') {
    return priceSliderMax;
  }
  const n = Number.parseFloat(state.priceMax);
  if (Number.isNaN(n)) {
    return priceSliderMax;
  }
  return Math.min(priceSliderMax, Math.max(0, n));
}

function buildNextState(
  base: SearchUrlState,
  v: FilterFormValues,
  priceSliderMax: number,
): SearchUrlState {
  const priceMin =
    v.priceMin != null && !Number.isNaN(v.priceMin) && v.priceMin > 0 ? String(v.priceMin) : '';
  const priceMax =
    v.priceMax != null && !Number.isNaN(v.priceMax) && v.priceMax < priceSliderMax
      ? String(v.priceMax)
      : '';
  const category = v.category && v.category !== CAT_ALL ? v.category.trim() : '';
  const supplierCity = (v.supplierCity ?? '').trim();

  return {
    ...base,
    page: 1,
    priceMin,
    priceMax,
    category,
    supplierCity,
    minStock: '',
    updatedFrom: '',
    availability: '',
    excludeOnRequest: false,
  };
}

const checkboxRowClass = 'flex items-center gap-1.5 py-0.5';

const formLabelClassName =
  '[&_.ant-form-item-label>label]:!h-auto [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-base [&_.ant-form-item-label>label]:!text-ink';

function clampPriceSlider(n: number, priceSliderMax: number): number {
  if (!Number.isFinite(n)) {
    return 0;
  }
  return Math.min(priceSliderMax, Math.max(0, Math.round(n)));
}

function FilterFieldsPrice({
  form,
  schedulePush,
  itemClassName,
  priceSliderMax,
}: {
  form: FormInstance<FilterFormValues>;
  schedulePush: () => void;
  itemClassName: string;
  priceSliderMax: number;
}) {
  return (
    <Form.Item label="Цена, ₽" className={itemClassName}>
      <div className="flex h-[50px] items-center gap-2 rounded-[4px] bg-[#f9fafb] px-4">
        <Form.Item name="priceMin" noStyle>
          <InputNumber
            min={0}
            max={priceSliderMax}
            controls={false}
            variant="borderless"
            placeholder="от"
            className="!min-w-0 !flex-1 !bg-transparent !text-base !text-ink [&_.ant-input-number-input]:!text-ink [&_.ant-input-number-input::placeholder]:!text-[#a7a7a7]"
          />
        </Form.Item>
        <span className="shrink-0 text-base text-[#a7a7a7]">—</span>
        <Form.Item name="priceMax" noStyle>
          <InputNumber
            min={0}
            max={priceSliderMax}
            controls={false}
            variant="borderless"
            placeholder="до"
            className="!min-w-0 !flex-1 !bg-transparent !text-base !text-ink [&_.ant-input-number-input::placeholder]:!text-[#a7a7a7]"
          />
        </Form.Item>
      </div>
      <Form.Item
        noStyle
        shouldUpdate={(p, c) => p.priceMin !== c.priceMin || p.priceMax !== c.priceMax}
      >
        {() => {
          const rawMin = form.getFieldValue('priceMin') as number | null | undefined;
          const rawMax = form.getFieldValue('priceMax') as number | null | undefined;
          let minVal =
            typeof rawMin === 'number' && !Number.isNaN(rawMin)
              ? clampPriceSlider(rawMin, priceSliderMax)
              : 0;
          let maxVal =
            typeof rawMax === 'number' && !Number.isNaN(rawMax)
              ? clampPriceSlider(rawMax, priceSliderMax)
              : priceSliderMax;
          if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
          }
          return (
            <div className="mt-4 px-3">
              <Slider
                range
                className="!mx-0 [&_.ant-slider-handle]:!border-[#264b82] [&_.ant-slider-handle]:!bg-white"
                min={0}
                max={priceSliderMax}
                value={[minVal, maxVal]}
                onChange={(pair) => {
                  const [a, b] = pair as [number, number];
                  form.setFieldValue('priceMin', clampPriceSlider(a, priceSliderMax));
                  form.setFieldValue('priceMax', clampPriceSlider(b, priceSliderMax));
                  schedulePush();
                }}
                tooltip={{
                  formatter: (val) => (val != null ? `${val.toLocaleString('ru-RU')} ₽` : ''),
                }}
              />
            </div>
          );
        }}
      </Form.Item>
    </Form.Item>
  );
}

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
            <input
              type="checkbox"
              checked={category === c.slug}
              onChange={(e) => {
                form.setFieldValue('category', e.target.checked ? c.slug : CAT_ALL);
                schedulePush();
              }}
              className="size-4 rounded-[2.5px] border border-[#bfc8d8]"
            />
            <span className="text-base font-normal text-ink">{c.label}</span>
          </label>
        ))}
      </div>
    </Form.Item>
  );
}

function FilterFieldsSupplierCity({ itemClassName }: { itemClassName: string }) {
  return (
    <Form.Item label="Город поставщика" className={itemClassName}>
      <div className="relative">
        <Form.Item name="supplierCity" noStyle>
          <Select
            allowClear
            placeholder="Любой"
            options={SUPPLIER_WAREHOUSE_CITIES.map((city) => ({ value: city, label: city }))}
            className="!h-[50px] !w-full [&_.ant-select-selector]:!rounded-[4px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-[#f9fafb] [&_.ant-select-selector]:!px-4 [&_.ant-select-selection-item]:!text-base [&_.ant-select-selection-item]:!text-ink"
          />
        </Form.Item>
        <MapPin
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink/50"
          strokeWidth={1.75}
          aria-hidden
        />
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
      <FilterFieldsPrice
        form={form}
        schedulePush={schedulePush}
        itemClassName="!mb-5"
        priceSliderMax={priceSliderMax}
      />
      <FilterFieldsManufacturer form={form} schedulePush={schedulePush} itemClassName="!mb-5" />
      <FilterFieldsSupplierCity itemClassName="!mb-0" />
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
      <FilterFieldsPrice
        form={form}
        schedulePush={schedulePush}
        itemClassName="!mb-8"
        priceSliderMax={priceSliderMax}
      />
      <FilterFieldsManufacturer form={form} schedulePush={schedulePush} itemClassName="!mb-8" />
      <FilterFieldsSupplierCity itemClassName="!mb-0" />
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
      category: v.category,
      supplierCity: v.supplierCity,
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
          <Typography.Title
            level={5}
            className="!mb-0 !text-[18px] !font-semibold !leading-5 !text-ink"
          >
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
        <div
          className="mt-3 inline-flex items-center gap-2 text-xs text-ink-secondary"
          aria-live="polite"
        >
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
            body: {
              paddingTop: 16,
              paddingBottom: 24,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            },
          }}
        >
          <FiltersFormFull
            form={fullForm}
            schedulePush={schedulePushWithStatus}
            priceSliderMax={priceSliderMax}
          />
        </Drawer>
      ) : null}
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
  const [fullForm] = Form.useForm<FilterFormValues>();
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [isFiltersUpdating, setIsFiltersUpdating] = useState(false);
  const pathname = usePathname();
  const fk = serializeFilterKey(state);
  const cap = priceSliderMax > 0 ? Math.floor(priceSliderMax) : DEFAULT_PRICE_SLIDER_MAX;
  const schedulePush = useDebouncedMergedFilterPush(null, fullForm, state, FILTER_DEBOUNCE_MS, cap);

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
    const v = urlStateToFilterValues(state, cap);
    fullForm.setFieldsValue(v);
  }, [fk, state, fullForm, cap]);

  if (!drawerMounted) {
    // Keep form instance connected until Drawer mounts to avoid antd warning.
    return <Form form={fullForm} component={false} />;
  }

  return (
    <Drawer
      title={
        <Typography.Title level={5} className="!mb-0 !text-lg !font-semibold !text-ink">
          Все фильтры
        </Typography.Title>
      }
      placement="left"
      size={360}
      open={open}
      destroyOnClose={false}
      forceRender
      onClose={onClose}
      classNames={{ body: 'scrollbar-filters' }}
      styles={{
        body: {
          paddingTop: 16,
          paddingBottom: 24,
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        },
      }}
    >
      {isFiltersUpdating ? (
        <div
          className="mb-3 inline-flex items-center gap-2 text-xs text-ink-secondary"
          aria-live="polite"
        >
          <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} aria-hidden />
          Обновляем результаты...
        </div>
      ) : null}
      <FiltersFormFull form={fullForm} schedulePush={schedulePushWithStatus} priceSliderMax={cap} />
    </Drawer>
  );
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
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[281px] lg:self-start">
      <SearchFiltersSidebarInner state={state} priceSliderMax={cap} />
    </aside>
  );
}

function serializeFilterKey(state: SearchUrlState): string {
  return [
    state.q,
    state.sort,
    state.supplier,
    state.supplierCity,
    state.category,
    state.priceMin,
    state.priceMax,
    state.pageSize,
  ].join('|');
}
