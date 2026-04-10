import { collectRussianCityNames, type HhAreaNode } from '@/lib/cities/hh-areas';

/** Ответ HH >2MB — не кладём в data cache Next; кэшируем в памяти инстанса. */
export const dynamic = 'force-dynamic';

const FALLBACK = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород'];

const TTL_MS = 86_400_000;
let memoryCache: { cities: string[]; fetchedAt: number } | null = null;

export async function GET() {
  const now = Date.now();
  if (memoryCache && now - memoryCache.fetchedAt < TTL_MS) {
    return Response.json({ cities: memoryCache.cities });
  }

  try {
    const res = await fetch('https://api.hh.ru/areas', {
      cache: 'no-store',
      headers: { 'User-Agent': 'ElectrotechWeb/1.0 (electrotech; city list)' },
    });
    if (!res.ok) {
      const cities = memoryCache?.cities.length ? memoryCache.cities : FALLBACK;
      return Response.json({ cities });
    }
    const data = (await res.json()) as HhAreaNode[];
    const cities = collectRussianCityNames(Array.isArray(data) ? data : []);
    if (cities.length === 0) {
      const out = memoryCache?.cities.length ? memoryCache.cities : FALLBACK;
      return Response.json({ cities: out });
    }
    memoryCache = { cities, fetchedAt: now };
    return Response.json({ cities });
  } catch {
    const cities = memoryCache?.cities.length ? memoryCache.cities : FALLBACK;
    return Response.json({ cities });
  }
}
