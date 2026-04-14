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
  const base = getPublicApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

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
      throw new PublicApiError(`API ${res.status} ${res.statusText}`, res.status);
    }

    try {
      return (await res.json()) as T;
    } catch {
      throw new PublicApiError('Некорректный ответ API', res.status);
    }
  } catch (e) {
    if (e instanceof PublicApiError) {
      throw e;
    }
    throw new PublicApiError(
      e instanceof Error ? e.message : 'Сеть недоступна',
      undefined,
    );
  }
}
