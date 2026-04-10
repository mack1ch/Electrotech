'use client';

import { Dropdown, Input } from 'antd';
import { ChevronDown, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { cn } from '@electrotech/ui';
import {
  DEFAULT_CITY_NAME,
  getSelectedCity,
  hasSavedCityPreference,
  setSelectedCity,
  subscribeSelectedCity,
  tryBeginGeoAttempt,
} from '@/lib/cities/city-preference';

function matchCityToList(raw: string, cities: string[]): string {
  const t = raw.trim();
  if (!t) return DEFAULT_CITY_NAME;
  const lower = t.toLocaleLowerCase('ru-RU');
  const exact = cities.find((c) => c.toLocaleLowerCase('ru-RU') === lower);
  if (exact) return exact;
  const fuzzy = cities.find(
    (c) =>
      lower.includes(c.toLocaleLowerCase('ru-RU')) ||
      c.toLocaleLowerCase('ru-RU').includes(lower),
  );
  return fuzzy ?? t;
}

type CityPickerProps = {
  variant: 'landing' | 'site';
  /** Дополнительные классы кнопки (видимость sm/lg, размер текста для site). */
  className?: string;
};

export function CityPicker({ variant, className }: CityPickerProps) {
  const city = useSyncExternalStore(subscribeSelectedCity, getSelectedCity, () => DEFAULT_CITY_NAME);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/cities');
        const data = (await r.json()) as { cities?: string[] };
        if (!cancelled && Array.isArray(data.cities) && data.cities.length > 0) {
          setCities(data.cities);
        }
      } catch {
        /* остаётся пустой список — подпись города из localStorage всё равно работает */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (cities.length === 0) return;
    if (hasSavedCityPreference()) return;
    if (!tryBeginGeoAttempt()) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const r = await fetch(
            `/api/geo-city?lat=${encodeURIComponent(String(latitude))}&lon=${encodeURIComponent(String(longitude))}`,
          );
          const data = (await r.json()) as { city?: string | null };
          if (data.city) {
            setSelectedCity(matchCityToList(data.city, cities));
          }
        } catch {
          /* ignore */
        }
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 12_000 },
    );
  }, [cities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('ru-RU');
    if (!q) return cities.slice(0, 200);
    return cities.filter((c) => c.toLocaleLowerCase('ru-RU').includes(q)).slice(0, 200);
  }, [cities, query]);

  const pick = useCallback((name: string) => {
    setSelectedCity(name);
    setOpen(false);
    setQuery('');
  }, []);

  const isLanding = variant === 'landing';
  const iconClass = isLanding ? 'text-white' : 'text-ink-secondary';
  const variantLabel =
    variant === 'landing'
      ? 'text-sm font-semibold uppercase tracking-[0.28px] text-white'
      : 'font-semibold uppercase tracking-wide text-ink-secondary';

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      placement="bottomRight"
      popupRender={() => (
        <div className="w-[min(100vw-1.5rem,22rem)] rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
          <Input
            allowClear
            placeholder="Поиск города"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-sm text-neutral-500">
                {cities.length === 0 ? 'Загрузка списка…' : 'Ничего не найдено'}
              </p>
            ) : (
              filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="flex w-full rounded px-2 py-2 text-left text-sm text-ink hover:bg-neutral-50"
                  onClick={() => pick(name)}
                >
                  {name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    >
      <button
        type="button"
        className={cn(
          'inline-flex shrink-0 items-center gap-1 transition-opacity hover:opacity-90',
          variantLabel,
          className,
        )}
        aria-label="Выбор города"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin className={cn('size-4 shrink-0', iconClass)} strokeWidth={2} aria-hidden />
        <span className="max-w-[9rem] truncate sm:max-w-[12rem]">{city}</span>
        <ChevronDown className={cn('size-4 shrink-0 opacity-90', iconClass)} strokeWidth={2} aria-hidden />
      </button>
    </Dropdown>
  );
}
