/** Производители для фильтра поиска (slug = GET /products?manufacturer=…). Синхронизируйте с `SEED_MANUFACTURERS` в API. */
export const SEARCH_FILTER_MANUFACTURERS = [
  { slug: 'elektrotechnika', label: 'Электротехника' },
  { slug: 'kabelny-zavod', label: 'Кабельный завод' },
  { slug: 'silovoy-kabel', label: 'Силовой кабель' },
  { slug: 'svyazka-shnur', label: 'Связка / шнур' },
  { slug: 'dekraft', label: 'DEKraft / аналог' },
  { slug: 'led-systems', label: 'LED Systems' },
  { slug: 'iek', label: 'IEK / аналог' },
  { slug: 'inkotex-merkuriy', label: 'Инкотекс / Меркурий' },
] as const;
