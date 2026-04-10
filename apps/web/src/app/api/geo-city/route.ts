import type { NextRequest } from 'next/server';

const UA = 'ElectrotechWeb/1.0 (electrotech; reverse geocode)';

function parseCoord(v: string | null): number | null {
  if (v == null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Прокси к Nominatim: координаты → населённый пункт (ru). См. https://operations.osmfoundation.org/policies/nominatim/ */
export async function GET(req: NextRequest) {
  const lat = parseCoord(req.nextUrl.searchParams.get('lat'));
  const lon = parseCoord(req.nextUrl.searchParams.get('lon'));
  if (lat == null || lon == null || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return Response.json({ city: null }, { status: 400 });
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('accept-language', 'ru');
  url.searchParams.set('zoom', '10');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': UA },
      cache: 'no-store',
    });
    if (!res.ok) {
      return Response.json({ city: null });
    }
    const data = (await res.json()) as {
      address?: Record<string, string>;
    };
    const a = data.address ?? {};
    const city =
      a['city'] ||
      a['town'] ||
      a['village'] ||
      a['municipality'] ||
      a['hamlet'] ||
      a['county'] ||
      null;
    return Response.json({ city: city?.trim() || null });
  } catch {
    return Response.json({ city: null });
  }
}
