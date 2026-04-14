/** Категории товара в поиске (тип номенклатуры). Отдельно от производителя — см. `filter-manufacturers.ts`. */
export const SEARCH_PRODUCT_CATEGORIES = [
  { slug: 'cable', label: 'Кабель и провод' },
  { slug: 'equipment', label: 'Электрооборудование' },
  { slug: 'switchgear', label: 'Распределительные устройства' },
  { slug: 'lighting', label: 'Светотехника' },
] as const;
