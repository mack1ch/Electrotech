'use client';

import { CalendarOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Drawer, InputNumber, Select, Slider } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoaderCircle, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@electrotech/ui';
import { SEARCH_FILTER_CATEGORIES } from '@/lib/search/filter-categories';
import { resetFiltersKeepQuery, searchPath, type SearchUrlState } from '@/lib/search/search-params';
import { useNavigationPending } from '@/lib/ui/use-navigation-pending';

type MobileFilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

function toNum(raw: string, fallback: number): number {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function SearchMobileFiltersCollapse({
  state,
  priceSliderMax,
}: {
  state: SearchUrlState;
  priceSliderMax: number;
}) {
  const router = useRouter();
  const { runNavigation, isPending } = useNavigationPending();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [open, setOpen] = useState(false);
  const cap = priceSliderMax > 0 ? Math.floor(priceSliderMax) : 99000;
  const filtersPending = isPending('search-mobile-filters-update');

  const pushPatch = useCallback(
    (patch: Partial<SearchUrlState>) => {
      if (filtersPending) {
        return;
      }
      runNavigation('search-mobile-filters-update', () => {
        router.push(searchPath({ ...state, ...patch, page: 1 }));
      });
    },
    [filtersPending, router, runNavigation, state],
  );

  const categoryLabel = useMemo(() => {
    const hit = SEARCH_FILTER_CATEGORIES.find((c) => c.slug === state.category);
    return hit?.label ?? '';
  }, [state.category]);

  const chips = useMemo<MobileFilterChip[]>(() => {
    const result: MobileFilterChip[] = [];
    if (state.minStock) {
      result.push({
        key: 'minStock',
        label: `${state.minStock} шт`,
        onRemove: () => pushPatch({ minStock: '' }),
      });
    }
    if (categoryLabel) {
      result.push({
        key: 'category',
        label: categoryLabel,
        onRemove: () => pushPatch({ category: '' }),
      });
    }
    if (state.availability) {
      const availabilityLabel =
        state.availability === 'in_stock'
          ? 'В наличии'
          : state.availability === 'on_order'
            ? 'Под заказ'
            : 'Ожидается';
      result.push({
        key: 'availability',
        label: availabilityLabel,
        onRemove: () => pushPatch({ availability: '' }),
      });
    }
    if (state.excludeOnRequest) {
      result.push({
        key: 'exclude',
        label: 'Без “по запросу”',
        onRemove: () => pushPatch({ excludeOnRequest: false }),
      });
    }
    return result;
  }, [categoryLabel, pushPatch, state]);

  const categories = showAllCategories ? SEARCH_FILTER_CATEGORIES : SEARCH_FILTER_CATEGORIES.slice(0, 4);
  const priceMin = Math.max(0, toNum(state.priceMin, 0));
  const priceMax = Math.min(cap, Math.max(priceMin, toNum(state.priceMax, cap)));

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('search-mobile-filters:open', onOpen as EventListener);
    return () => window.removeEventListener('search-mobile-filters:open', onOpen as EventListener);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sr-only lg:hidden"
        aria-label="Открыть фильтры"
      />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        size="large"
        className="lg:!hidden"
        styles={{ body: { padding: 16, background: '#f4f5f9' } }}
        title={
          <div className="flex items-end justify-between">
            <div className="text-[18px] font-semibold leading-[22px] text-[#0a0a0a]">Фильтры</div>
            <Link href={searchPath(resetFiltersKeepQuery(state))} className="text-sm text-brand hover:underline">
              Сбросить
            </Link>
          </div>
        }
      >
        <section className="rounded-[8px] bg-transparent">
          {filtersPending ? (
            <div className="mb-3 inline-flex items-center gap-2 text-xs text-ink-secondary" aria-live="polite">
              <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} aria-hidden />
              Обновляем результаты...
            </div>
          ) : null}
          {chips.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-1">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#264b82] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#18345b]"
                >
                  {chip.label}
                  <span className="inline-flex size-5 items-center justify-center rounded-[2px] bg-white/20">
                    <CloseOutlined className="text-[10px]" />
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="rounded-[8px] bg-white p-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => pushPatch({ category: '' })}
                  className={cn(
                    'w-full rounded-[10px] px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1',
                    state.category === '' ? 'bg-[#e5efff] font-semibold text-brand' : 'text-[#0a0a0a]',
                  )}
                >
                  Все категории
                </button>
                {categories.map((category) => {
                  const active = state.category === category.slug;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => pushPatch({ category: category.slug })}
                      className={cn(
                        'flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1',
                        active ? 'bg-[#e5efff] font-semibold text-brand' : 'text-[#0a0a0a]',
                      )}
                    >
                      <span className="whitespace-normal leading-[17px]">{category.label}</span>
                      <DownOutlined className="-rotate-90 text-[12px]" />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  className="rounded px-4 py-1 text-sm text-brand transition-colors hover:text-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1"
                >
                  {showAllCategories ? 'Скрыть категории' : 'Больше категорий'}
                </button>
              </div>
            </div>

            <div className="space-y-4 rounded-[8px] bg-white p-6">
              <div>
                <div className="mb-2 text-base font-semibold text-[#0a0a0a]">Наличие</div>
                <div className="space-y-2">
                  {[
                    { id: 'in_stock', label: 'В наличии' },
                    { id: 'on_order', label: 'Под заказ' },
                    { id: 'expected', label: 'Ожидается' },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 text-sm text-[#0a0a0a]">
                      <Checkbox
                        checked={state.availability === item.id}
                        onChange={(e) =>
                          pushPatch({ availability: e.target.checked ? item.id : '', page: 1 } as Partial<SearchUrlState>)
                        }
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-base font-semibold text-[#0a0a0a]">Минимальное количество</div>
                <InputNumber
                  min={0}
                  controls={false}
                  value={state.minStock === '' ? null : Number.parseInt(state.minStock, 10)}
                  onChange={(v) => pushPatch({ minStock: v && v > 0 ? String(Math.floor(v)) : '' })}
                  placeholder="0"
                  className="!h-[50px] !w-full !rounded-[4px] !border-0 !bg-[#f9fafb] !px-[13px]"
                />
              </div>

              <div>
                <div className="mb-2 text-base font-semibold text-[#0a0a0a]">Цена, ₽</div>
                <div className="rounded-[4px] bg-[#f9fafb] p-4">
                  <div className="mb-3 flex items-center justify-between text-base text-[#a7a7a7]">
                    <span>{priceMin.toLocaleString('ru-RU')}</span>
                    <span>—</span>
                    <span>{priceMax.toLocaleString('ru-RU')}</span>
                  </div>
                  <Slider
                    range
                    min={0}
                    max={cap}
                    value={[priceMin, priceMax]}
                    onChange={(value) => {
                      const [nextMin, nextMax] = value as [number, number];
                      pushPatch({
                        priceMin: nextMin > 0 ? String(nextMin) : '',
                        priceMax: nextMax < cap ? String(nextMax) : '',
                      });
                    }}
                  />
                </div>
                <label className="mt-3 flex items-center gap-2 text-base text-[#0a0a0a]">
                  <Checkbox
                    checked={state.excludeOnRequest}
                    onChange={(e) => pushPatch({ excludeOnRequest: e.target.checked })}
                  />
                  Исключить &quot;по запросу&quot;
                </label>
              </div>

              <div>
                <div className="mb-2 text-base font-semibold text-[#0a0a0a]">Сроки доставки</div>
                <DatePicker
                  value={state.updatedFrom ? dayjs(state.updatedFrom) : null}
                  onChange={(v: Dayjs | null) => pushPatch({ updatedFrom: v?.isValid() ? v.format('YYYY-MM-DD') : '' })}
                  format="DD.MM.YYYY"
                  className="!h-[50px] !w-full !rounded-[4px] !border-0 !bg-[#f9fafb] !px-4"
                  suffixIcon={<CalendarOutlined className="text-[#264b82]" />}
                />
              </div>

              <div>
                <div className="mb-2 text-base font-semibold text-[#0a0a0a]">Расположение склада</div>
                <Select
                  disabled
                  value=""
                  options={[{ value: '', label: 'Любое' }]}
                  className="!h-[50px] !w-full [&_.ant-select-selector]:!rounded-[4px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-[#f9fafb]"
                  suffixIcon={<MapPin className="size-5 text-[#264b82]" />}
                />
              </div>
            </div>

            <div className="rounded-[8px] bg-white p-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-base font-semibold text-[#0a0a0a]">Производитель</div>
                <button
                  type="button"
                  onClick={() => pushPatch({ category: '' })}
                  className="rounded text-sm text-brand transition-colors hover:text-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1"
                >
                  Все
                </button>
              </div>
              <div className="space-y-2">
                {SEARCH_FILTER_CATEGORIES.slice(0, 4).map((category) => (
                  <label key={category.slug} className="flex items-center gap-2 text-base text-[#0a0a0a]">
                    <Checkbox
                      checked={state.category === category.slug}
                      onChange={(e) => pushPatch({ category: e.target.checked ? category.slug : '' })}
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              block
              type="primary"
              onClick={() => {
                runNavigation('search-mobile-filters-update', () => {
                  router.push(searchPath({ ...state, page: 1 }));
                });
                setOpen(false);
              }}
              className="!h-[53px] !rounded-[4px] !border-0 !bg-[#264b82] !text-base !font-semibold"
              disabled={filtersPending}
              aria-busy={filtersPending}
            >
              {filtersPending ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden />
                  Применяем...
                </span>
              ) : (
                'Применить фильтры'
              )}
            </Button>
          </div>
        </section>
      </Drawer>
    </>
  );
}
