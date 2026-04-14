'use client';

import { Button, Checkbox, DatePicker, Drawer, Form, Input, InputNumber, Slider, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Calendar, LoaderCircle, MapPin, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@electrotech/ui';
import { SEARCH_FILTER_CATEGORIES } from '@/lib/search/filter-categories';
import type { SearchUrlState } from '@/lib/search/search-params';
import { resetFiltersKeepQuery, searchPath } from '@/lib/search/search-params';

dayjs.locale('ru');

const CAT_ALL = '__all__';
const FILTER_DEBOUNCE_MS = 450;
const DEFAULT_PRICE_SLIDER_MAX = 99000;

type FilterFormValues = {
  priceMin?: number | null;
  priceMax?: number | null;
  minStock?: number | null;
  updatedFrom?: Dayjs | null;
  availability?: string;
  category?: string;
  excludeOnRequest?: boolean;
};

function urlStateToFilterValues(state: SearchUrlState, priceSliderMax: number): FilterFormValues {
  return {
    priceMin: toPriceMin(state),
    priceMax: toPriceMax(state, priceSliderMax),
    minStock: state.minStock === '' ? undefined : Number.parseInt(state.minStock, 10) || undefined,
    updatedFrom: state.updatedFrom ? dayjs(state.updatedFrom) : undefined,
    availability:
      state.availability === 'in_stock' ||
      state.availability === 'on_order' ||
      state.availability === 'expected'
        ? state.availability
        : '',
    category: state.category || CAT_ALL,
    excludeOnRequest: state.excludeOnRequest,
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

function buildNextState(base: SearchUrlState, v: FilterFormValues, priceSliderMax: number): SearchUrlState {
  const priceMin =
    v.priceMin != null && !Number.isNaN(v.priceMin) && v.priceMin > 0 ? String(v.priceMin) : '';
  const priceMax =
    v.priceMax != null && !Number.isNaN(v.priceMax) && v.priceMax < priceSliderMax ? String(v.priceMax) : '';
  const minStock =
    v.minStock != null && !Number.isNaN(v.minStock) && v.minStock > 0 ? String(Math.floor(v.minStock)) : '';
  const updatedFrom = v.updatedFrom?.isValid() ? v.updatedFrom.format('YYYY-MM-DD') : '';
  const availability =
    v.availability &&
    (v.availability === 'in_stock' || v.availability === 'on_order' || v.availability === 'expected')
      ? v.availability
      : '';
  const category = v.category && v.category !== CAT_ALL ? v.category.trim() : '';

  return {
    ...base,
    page: 1,
    priceMin,
    priceMax,
    minStock,
    updatedFrom,
    availability,
    category,
    excludeOnRequest: Boolean(v.excludeOnRequest),
  };
}

const checkboxRowClass =
  'flex items-center gap-1.5 py-0.5 [&_.ant-checkbox]:items-start [&_.ant-checkbox-inner]:!h-4 [&_.ant-checkbox-inner]:!w-4 [&_.ant-checkbox-inner]:!rounded-[2.5px]';

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
            typeof rawMin === 'number' && !Number.isNaN(rawMin) ? clampPriceSlider(rawMin, priceSliderMax) : 0;
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
      <Form.Item name="excludeOnRequest" valuePropName="checked" className="!mb-0 !mt-2">
        <Checkbox className="[&_.ant-checkbox-inner]:!rounded-[2.5px] [&_.ant-checkbox-inner]:!bg-[#f9fafb]">
          <span className="text-base font-normal text-ink">Исключить &quot;по запросу&quot;</span>
        </Checkbox>
      </Form.Item>
    </Form.Item>
  );
}

function FilterFieldsMinStock({ itemClassName }: { itemClassName: string }) {
  return (
    <Form.Item label="Минимальное количество" className={itemClassName}>
      <Form.Item name="minStock" noStyle>
        <InputNumber
          min={0}
          placeholder="0"
          className="!h-[50px] !w-full !rounded-[4px] !bg-[#f9fafb] !px-[13px] !text-base [&_.ant-input-number-input]:!text-ink [&_.ant-input-number-input::placeholder]:!text-[#a7a7a7]"
          controls={false}
        />
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

function FilterFieldsAvailability({
  form,
  schedulePush,
  itemClassName,
}: {
  form: FormInstance<FilterFormValues>;
  schedulePush: () => void;
  itemClassName: string;
}) {
  const availability = Form.useWatch('availability', form) ?? '';

  return (
    <Form.Item label="Наличие" className={itemClassName}>
      <div className="flex flex-col gap-2">
        <label className={cn(checkboxRowClass, 'cursor-pointer')}>
          <Checkbox
            checked={availability === 'in_stock'}
            className="[&_.ant-checkbox-inner]:!rounded-[2.5px]"
            onChange={(e) => {
              form.setFieldValue('availability', e.target.checked ? 'in_stock' : '');
              schedulePush();
            }}
          />
          <span className="text-base font-normal text-ink">В наличии</span>
        </label>
        <label className={cn(checkboxRowClass, 'cursor-pointer')}>
          <Checkbox
            checked={availability === 'on_order'}
            className="[&_.ant-checkbox-inner]:!rounded-[2.5px]"
            onChange={(e) => {
              form.setFieldValue('availability', e.target.checked ? 'on_order' : '');
              schedulePush();
            }}
          />
          <span className="text-base font-normal text-ink">Под заказ</span>
        </label>
        <label className={cn(checkboxRowClass, 'cursor-pointer')}>
          <Checkbox
            checked={availability === 'expected'}
            className="[&_.ant-checkbox-inner]:!rounded-[2.5px]"
            onChange={(e) => {
              form.setFieldValue('availability', e.target.checked ? 'expected' : '');
              schedulePush();
            }}
          />
          <span className="text-base font-normal text-ink">Ожидается</span>
        </label>
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
      <FilterFieldsAvailability form={form} schedulePush={schedulePush} itemClassName="!mb-5" />
      <FilterFieldsMinStock itemClassName="!mb-5" />
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
      <FilterFieldsPrice
        form={form}
        schedulePush={schedulePush}
        itemClassName="!mb-8"
        priceSliderMax={priceSliderMax}
      />

      <FilterFieldsMinStock itemClassName="!mb-8" />

      <Form.Item label="Последнее обновление" className="!mb-8">
        <Form.Item name="updatedFrom" noStyle>
          <DatePicker
            format="DD.MM.YYYY"
            placeholder="Введите дату"
            allowClear
            className="!h-[52px] !w-full !rounded-[4px] !border-0 !bg-[#f9fafb] !px-4 !text-base"
            suffixIcon={<Calendar className="size-4 text-ink/50" strokeWidth={1.75} aria-hidden />}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item label="Расположение склада" className="!mb-8">
        <Input
          readOnly
          disabled
          placeholder="Введите город"
          className="!h-[52px] !cursor-default !rounded-[4px] !border-0 !bg-[#f9fafb] !px-4 !text-base !text-ink/40 [&_input::placeholder]:!text-ink/40"
          suffix={<MapPin className="size-6 text-ink/60" strokeWidth={1.75} aria-hidden />}
        />
      </Form.Item>

      <FilterFieldsAvailability form={form} schedulePush={schedulePush} itemClassName="!mb-8" />

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
  const searchParams = useSearchParams();
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
  }, [pathname, searchParams]);

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
          <FiltersFormFull form={fullForm} schedulePush={schedulePushWithStatus} priceSliderMax={priceSliderMax} />
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
  const searchParams = useSearchParams();
  const fk = serializeFilterKey(state);
  const cap = priceSliderMax > 0 ? Math.floor(priceSliderMax) : DEFAULT_PRICE_SLIDER_MAX;
  const schedulePush = useDebouncedMergedFilterPush(null, fullForm, state, FILTER_DEBOUNCE_MS, cap);

  useEffect(() => {
    setDrawerMounted(true);
  }, []);

  useEffect(() => {
    setIsFiltersUpdating(false);
  }, [pathname, searchParams]);

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
        body: { paddingTop: 16, paddingBottom: 24, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
      }}
    >
      {isFiltersUpdating ? (
        <div className="mb-3 inline-flex items-center gap-2 text-xs text-ink-secondary" aria-live="polite">
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
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[321px] lg:self-start">
      <SearchFiltersSidebarInner state={state} priceSliderMax={cap} />
    </aside>
  );
}

function serializeFilterKey(state: SearchUrlState): string {
  return [
    state.q,
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
