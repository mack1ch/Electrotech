'use client';

import { CalendarOutlined, DownOutlined, SlidersOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, InputNumber, Select, Slider } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@electrotech/ui';
import { fetchPublicApiJson } from '@/lib/api/public-api';
import { SearchAllFiltersDrawer } from '@/components/search/search-filters-sidebar';
import { SEARCH_FILTER_CATEGORIES } from '@/lib/search/filter-categories';
import type { SearchUrlState } from '@/lib/search/search-params';
import { parseSearchUrlState, searchPath } from '@/lib/search/search-params';
import type { ApiProductPriceFilterMeta } from '@/lib/types/catalog';

const DEFAULT_PRICE_SLIDER_MAX = 99000;

const landingFormLabelClass =
  '[&_.ant-form-item-label>label]:!h-auto [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-base [&_.ant-form-item-label>label]:!text-[#0a0a0a]';

const selectShellClass =
  'relative flex h-[52px] items-center rounded-[4px] bg-[#f9fafb] px-4 transition-[background-color,box-shadow] duration-150 hover:bg-[#f4f6f8] has-[.ant-select-open]:bg-[#f4f6f8]';

const selectClassName =
  'w-full min-w-0 flex-1 [&_.ant-select-arrow]:!text-[#0a0a0a] [&_.ant-select-selection-item]:!text-base [&_.ant-select-selection-item]:!leading-5 [&_.ant-select-selection-placeholder]:!text-base [&_.ant-select-selection-placeholder]:!leading-5 [&_.ant-select-selection-placeholder]:!text-[#a7a7a7] [&_.ant-select-selector]:!h-[52px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-0 [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!text-[#0a0a0a]';

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Любые' },
  { value: 'in_stock', label: 'В наличии' },
  { value: 'on_order', label: 'Под заказ' },
  { value: 'expected', label: 'Ожидается поставка' },
] as const;

const CATEGORY_OPTIONS = [
  { value: '', label: 'Любой' },
  ...SEARCH_FILTER_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
];

type LandingSearchFormValues = {
  q: string;
  availability: string;
  category: string;
  priceMin: number | null;
  priceMax: number | null;
};

function clampPriceSlider(n: number, priceSliderMax: number): number {
  if (!Number.isFinite(n)) {
    return 0;
  }
  return Math.min(priceSliderMax, Math.max(0, Math.round(n)));
}

function buildSearchStateFromForm(
  v: LandingSearchFormValues,
  priceSliderMax: number,
): SearchUrlState {
  const base = parseSearchUrlState({});
  let minVal =
    typeof v.priceMin === 'number' && !Number.isNaN(v.priceMin)
      ? clampPriceSlider(v.priceMin, priceSliderMax)
      : 0;
  let maxVal =
    typeof v.priceMax === 'number' && !Number.isNaN(v.priceMax)
      ? clampPriceSlider(v.priceMax, priceSliderMax)
      : priceSliderMax;
  if (minVal > maxVal) {
    [minVal, maxVal] = [maxVal, minVal];
  }

  const availability =
    v.availability === 'in_stock' || v.availability === 'on_order' || v.availability === 'expected'
      ? v.availability
      : '';
  const category = (v.category ?? '').trim();

  return {
    ...base,
    q: (v.q ?? '').trim(),
    page: 1,
    category,
    availability,
    priceMin: minVal > 0 ? String(minVal) : '',
    priceMax: maxVal < priceSliderMax ? String(maxVal) : '',
  };
}

function chipHref(label: string, category?: string): string {
  const p = new URLSearchParams();
  if (category) {
    p.set('category', category);
  } else {
    p.set('q', label);
  }
  return `/search?${p.toString()}`;
}

const chips: { label: string; href: string }[] = [
  { label: 'Кабель', href: chipHref('Кабель', 'cable') },
  { label: 'Трансформаторы', href: chipHref('Трансформаторы') },
  { label: 'Автоматические выключатели', href: chipHref('Автоматические выключатели') },
  { label: 'Контакторы', href: chipHref('Контакторы') },
];

function formatPriceRu(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

export function LandingHeroSearch() {
  const router = useRouter();
  const [form] = Form.useForm<LandingSearchFormValues>();
  const [priceSliderMax, setPriceSliderMax] = useState(DEFAULT_PRICE_SLIDER_MAX);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [allFiltersOpen, setAllFiltersOpen] = useState(false);
  const [filterDrawerState, setFilterDrawerState] = useState<SearchUrlState>(() => parseSearchUrlState({}));

  const openAllFiltersDrawer = useCallback(() => {
    setFilterDrawerState(buildSearchStateFromForm(form.getFieldsValue(true), priceSliderMax));
    setAllFiltersOpen(true);
  }, [form, priceSliderMax]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const m = await fetchPublicApiJson<ApiProductPriceFilterMeta>('/product-price-filter-meta');
        if (cancelled) {
          return;
        }
        const cap = m.priceMax;
        if (Number.isFinite(cap) && cap > 0) {
          const max = Math.trunc(cap);
          setPriceSliderMax(max);
          const curMin = form.getFieldValue('priceMin') as number | null | undefined;
          const curMax = form.getFieldValue('priceMax') as number | null | undefined;
          const nextMin =
            typeof curMin === 'number' && !Number.isNaN(curMin) ? clampPriceSlider(curMin, max) : 0;
          let nextMax =
            typeof curMax === 'number' && !Number.isNaN(curMax) ? clampPriceSlider(curMax, max) : max;
          if (nextMin > nextMax) {
            nextMax = nextMin;
          }
          form.setFieldsValue({ priceMin: nextMin, priceMax: nextMax });
        }
      } catch {
        /* API недоступен — оставляем дефолтный потолок цены */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form]);

  const onFinish = useCallback(
    (v: LandingSearchFormValues) => {
      router.push(searchPath(buildSearchStateFromForm(v, priceSliderMax)));
    },
    [router, priceSliderMax],
  );

  const pricePanel = (
    <div
      className="w-[min(100vw-2rem,320px)] rounded-lg border border-neutral-200 bg-white p-4 shadow-lg"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="mb-3 text-sm font-medium text-[#0a0a0a]">Диапазон цены, ₽</p>
      <div className="mb-4 flex h-[50px] items-center gap-2 rounded-[4px] bg-[#f9fafb] px-3">
        <Form.Item name="priceMin" noStyle>
          <InputNumber
            min={0}
            max={priceSliderMax}
            controls={false}
            variant="borderless"
            placeholder="от"
            className="!min-w-0 !flex-1 !bg-transparent !text-base !text-[#0a0a0a] [&_.ant-input-number-input]:!text-[#0a0a0a] [&_.ant-input-number-input::placeholder]:!text-[#a7a7a7]"
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
            className="!min-w-0 !flex-1 !bg-transparent !text-base !text-[#0a0a0a] [&_.ant-input-number-input::placeholder]:!text-[#a7a7a7]"
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
            <Slider
              range
              className="!mx-0 [&_.ant-slider-handle]:!border-[#264b82] [&_.ant-slider-handle]:!bg-white"
              min={0}
              max={priceSliderMax}
              value={[minVal, maxVal]}
              onChange={(pair) => {
                const [a, b] = pair as [number, number];
                form.setFieldsValue({
                  priceMin: clampPriceSlider(a, priceSliderMax),
                  priceMax: clampPriceSlider(b, priceSliderMax),
                });
              }}
              tooltip={{ formatter: (val) => (val != null ? `${val.toLocaleString('ru-RU')} ₽` : '') }}
            />
          );
        }}
      </Form.Item>
      <div className="mt-2 flex justify-between text-xs text-[#6a7282]">
        <span>0</span>
        <span>{formatPriceRu(priceSliderMax)}</span>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-[50px]">
      <Form<LandingSearchFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        colon={false}
        preserve
        onFinish={onFinish}
        className={cn(landingFormLabelClass, 'landing-hero-search-form w-full')}
        initialValues={{
          q: '',
          availability: '',
          category: '',
          priceMin: 0,
          priceMax: DEFAULT_PRICE_SLIDER_MAX,
        }}
      >
        <div className="w-full bg-white px-4 pb-4 pt-6 shadow-[0_8px_32px_rgba(38,46,63,0.08)] lg:rounded-none lg:p-10 lg:shadow-[0_8px_32px_rgba(38,46,63,0.06)]">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-4 lg:gap-y-6">
            <Form.Item name="q" label="Позиция" className="!mb-0 min-w-0 flex-1 lg:min-w-[140px]">
              <div className="rounded-[4px] bg-[#f9fafb] px-4 transition-[background-color] duration-150 hover:bg-[#f4f6f8]">
                <Input
                  placeholder="Артикул/Название"
                  variant="borderless"
                  allowClear
                  className="!h-[52px] !bg-transparent !px-0 !text-base !text-[#0a0a0a] [&_input::placeholder]:!text-[#a7a7a7]"
                />
              </div>
            </Form.Item>

            <Form.Item name="availability" label="Сроки доставки" className="!mb-0 min-w-0 flex-1 lg:min-w-[140px]">
              <div className={selectShellClass}>
                <Select
                  aria-label="Сроки доставки"
                  variant="borderless"
                  options={[...AVAILABILITY_OPTIONS]}
                  className={selectClassName}
                  popupMatchSelectWidth={false}
                  getPopupContainer={(trigger) => trigger.closest('form') ?? document.body}
                  suffixIcon={<CalendarOutlined className="!text-base text-[#0a0a0a]/70" />}
                />
              </div>
            </Form.Item>

            <Form.Item name="category" label="Производитель" className="!mb-0 min-w-0 flex-1 lg:min-w-[140px]">
              <div className={selectShellClass}>
                <Select
                  aria-label="Производитель"
                  variant="borderless"
                  showSearch
                  optionFilterProp="label"
                  options={[...CATEGORY_OPTIONS]}
                  className={selectClassName}
                  popupMatchSelectWidth={false}
                  getPopupContainer={(trigger) => trigger.closest('form') ?? document.body}
                  suffixIcon={<DownOutlined className="!text-[13px] text-[#0a0a0a]" />}
                />
              </div>
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Стоимость<span className="tracking-[-0.16px]">, ₽</span>
                </span>
              }
              className="!mb-0 min-w-0 flex-1 lg:min-w-[160px]"
            >
              <div className="flex w-full items-end gap-2">
                <Dropdown
                  open={priceDropdownOpen}
                  onOpenChange={setPriceDropdownOpen}
                  trigger={['click']}
                  placement="bottomLeft"
                  getPopupContainer={(trigger) => trigger.closest('form') ?? document.body}
                  popupRender={() => pricePanel}
                >
                  <div className="relative flex h-[52px] min-w-0 flex-1 cursor-pointer items-center rounded-[4px] bg-[#f9fafb] px-4 transition-[background-color] duration-150 hover:bg-[#f4f6f8]">
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
                          <span className="flex w-full items-center justify-between gap-2 text-base">
                            <span className={minVal > 0 ? 'text-[#0a0a0a]' : 'text-[#a7a7a7]'}>
                              {formatPriceRu(minVal)}
                            </span>
                            <span className="text-[#a7a7a7]" aria-hidden>
                              —
                            </span>
                            <span className={maxVal < priceSliderMax ? 'text-[#0a0a0a]' : 'text-[#a7a7a7]'}>
                              {formatPriceRu(maxVal)}
                            </span>
                          </span>
                        );
                      }}
                    </Form.Item>
                  </div>
                </Dropdown>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openAllFiltersDrawer();
                  }}
                  className={cn(
                    'flex size-[52px] shrink-0 items-center justify-center rounded-[10px] bg-[#f9fafb] text-[#0a0a0a]/85',
                    'transition-[background-color,transform] duration-150 hover:bg-[#f0f3f7] active:scale-[0.98]',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#264b82]',
                  )}
                  aria-label="Все фильтры"
                >
                  <SlidersOutlined className="text-xl" />
                </button>
              </div>
            </Form.Item>

            <div className="flex w-full min-w-0 flex-1 items-end lg:min-w-[200px]">
              <Button
                type="primary"
                htmlType="submit"
                className="!h-[52px] w-full !rounded-none !border-0 !bg-[#264b82] !px-12 !text-[19px] !font-bold !leading-[25px] !text-[#f9fafb] hover:!bg-[#1f3d68] lg:!w-auto lg:!min-w-[140px]"
              >
                Найти
              </Button>
            </div>
          </div>
        </div>
      </Form>

      {/* Отдельно от карточки поиска: только белые кнопки на фоне страницы */}
      <div className="mt-3 flex w-full flex-wrap gap-3">
        {chips.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={cn(
              'flex h-10 items-center rounded-[4px] bg-white px-4 py-2 text-sm font-normal leading-5 text-[#0a0a0a]',
              'transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.98]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#264b82]',
              'lg:h-auto lg:px-4 lg:py-4 lg:text-base lg:leading-5',
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <SearchAllFiltersDrawer
        open={allFiltersOpen}
        onClose={() => setAllFiltersOpen(false)}
        state={filterDrawerState}
        priceSliderMax={priceSliderMax}
      />
    </div>
  );
}
