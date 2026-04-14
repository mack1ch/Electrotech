import type { SupplierPortalBadge } from '@/lib/supplier-portal-badge';

export type { SupplierPortalBadge } from '@/lib/supplier-portal-badge';

export type ApiSupplierRef = {
  id: string;
  slug: string;
  name: string;
  /** Таблица каталога поставщиков (Figma 0:4474); при отсутствии в ответе API — «—» в ячейках. */
  inn?: string | null;
  warehouseCitiesLine?: string | null;
  website?: string | null;
  phone?: string | null;
  emailsLine?: string | null;
  otherLine?: string | null;
};

export type ApiCategoryRef = {
  id: string;
  slug: string;
  name: string;
};

export type ApiManufacturerRef = {
  id: string;
  slug: string;
  name: string;
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  article: string | null;
  /** Числовая строка в ₽ или литерал «По запросу». */
  price: string;
  stockQuantity: number;
  lastUpdatedAt: string | null;
  supplier: ApiSupplierRef;
  category: ApiCategoryRef | null;
  manufacturer: ApiManufacturerRef | null;
};

export type ApiProductSpecification = { label: string; value: string };

export type ApiProductOffer = {
  supplierName: string;
  supplierSlug: string;
  price: string;
  warehouseLines: string[];
  stockQuantity: number;
  minOrderQuantity: number | null;
  lastUpdatedAt: string | null;
  phone: string | null;
  email: string | null;
  /** Мобильная карточка предложения: первая строка под заголовком «Наличие» (напр. «30 км»). */
  availabilityLine?: string | null;
};

export type ApiSupplierCard = {
  companyName: string;
  slug: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  inn: string | null;
  innSourcesLine: string | null;
  onPortalSince: string | null;
  /** Явный статус «На портале»; если null — на клиенте выводится по `onPortalSince`. */
  onPortalBadge: SupplierPortalBadge | null;
};

/** Ответ GET /products/:slug (расширенная карточка для страницы товара). */
export type ApiProductDetail = Omit<ApiProduct, 'manufacturer'> & {
  priceMax: string | null;
  /** Текстовая подпись производителя в карточке (отдельно от `manufacturer` в списке — там объект). */
  manufacturer: string | null;
  description: string | null;
  specifications: ApiProductSpecification[];
  supplierCard: ApiSupplierCard;
  offers: ApiProductOffer[];
};

export type ApiProductListResponse = {
  items: ApiProduct[];
  total: number;
};

/** Ответ GET /product-price-filter-meta — потолок для фильтра «Цена» на клиенте. */
export type ApiProductPriceFilterMeta = {
  priceMax: number;
};

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
};

export type ApiSupplierListResponse = {
  items: ApiSupplierRef[];
  total: number;
};

export type ApiSupplierBranch = {
  city: string;
  address: string;
  hoursWeekday: string;
  hoursWeekend: string;
  productCount: number;
};

/** Ответ GET /suppliers/:slug (карточка поставщика). */
export type ApiSupplierDetail = ApiSupplierRef & {
  legalAddress: string | null;
  website: string | null;
  inn: string | null;
  innSourcesLine: string | null;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  branches: ApiSupplierBranch[];
  description: string | null;
};
