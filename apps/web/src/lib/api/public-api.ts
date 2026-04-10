import {
  resolveCatalogDevMockFromPath,
  tryCatalogDevMockResponse,
} from '@/lib/mocks/catalog-dev-mock';

const DEFAULT_DEV_API = 'http://localhost:4000';

export function getPublicApiBaseUrl(): string {
  const fromEnv = process.env['NEXT_PUBLIC_API_URL'];
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_DEV_API;
}

export class PublicApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'PublicApiError';
  }
}

export async function fetchPublicApiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const mock = tryCatalogDevMockResponse(path);
  if (mock.kind === 'data') {
    return mock.body as T;
  }
  if (mock.kind === 'notFound') {
    throw new PublicApiError('Not found', 404);
  }

  const base = getPublicApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const tryDevMockFallback = (): T | null => {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }
    const strict = process.env['NEXT_PUBLIC_DEV_API_NO_FALLBACK'];
    if (strict === '1' || strict === 'true') {
      return null;
    }
    const fb = resolveCatalogDevMockFromPath(path);
    if (fb.kind === 'data') {
      return fb.body as T;
    }
    if (fb.kind === 'notFound') {
      throw new PublicApiError('Not found', 404);
    }
    return null;
  };

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.headers as HeadersInit | undefined),
      },
    });

    if (!res.ok) {
      const fallback = tryDevMockFallback();
      if (fallback !== null) {
        return fallback;
      }
      throw new PublicApiError(`API ${res.status} ${res.statusText}`, res.status);
    }

    try {
      return (await res.json()) as T;
    } catch {
      const fallback = tryDevMockFallback();
      if (fallback !== null) {
        return fallback;
      }
      throw new PublicApiError('Некорректный ответ API', res.status);
    }
  } catch (e) {
    if (e instanceof PublicApiError) {
      throw e;
    }
    const fallback = tryDevMockFallback();
    if (fallback !== null) {
      return fallback;
    }
    throw new PublicApiError(
      e instanceof Error ? e.message : 'Сеть недоступна',
      undefined,
    );
  }
}
