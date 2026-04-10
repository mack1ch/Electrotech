export const SELECTED_CITY_STORAGE_KEY = 'electrotech.selectedCity';
export const DEFAULT_CITY_NAME = 'Москва';

const GEO_SESSION_KEY = 'electrotech.geoCityAttempted';

const listeners = new Set<() => void>();

/** Одна попытка геолокации за сессию (чтобы два инстанса CityPicker не дергали API дважды). */
export function tryBeginGeoAttempt(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem(GEO_SESSION_KEY) === '1') return false;
    sessionStorage.setItem(GEO_SESSION_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

function emit() {
  for (const cb of listeners) cb();
}

export function getSelectedCity(): string {
  if (typeof window === 'undefined') return DEFAULT_CITY_NAME;
  try {
    const v = localStorage.getItem(SELECTED_CITY_STORAGE_KEY);
    return v?.trim() || DEFAULT_CITY_NAME;
  } catch {
    return DEFAULT_CITY_NAME;
  }
}

export function setSelectedCity(name: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SELECTED_CITY_STORAGE_KEY, name.trim() || DEFAULT_CITY_NAME);
    emit();
  } catch {
    /* ignore quota / private mode */
  }
}

export function subscribeSelectedCity(onChange: () => void) {
  listeners.add(onChange);
  if (typeof window === 'undefined') {
    return () => listeners.delete(onChange);
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === SELECTED_CITY_STORAGE_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function hasSavedCityPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem(SELECTED_CITY_STORAGE_KEY)?.trim());
  } catch {
    return false;
  }
}
