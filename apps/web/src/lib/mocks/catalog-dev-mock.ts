/**
 * Локальный мок каталога для `next dev`: те же сущности, что в сиде API
 * (`apps/api/src/catalog/catalog-seed.data.ts`), без поднятого Nest/Postgres.
 * Сначала мок: по умолчанию в dev. Реальный API: NEXT_PUBLIC_USE_REAL_API=1;
 * если он недоступен, в dev подставляется мок (отключить fallback: NEXT_PUBLIC_DEV_API_NO_FALLBACK=1).
 */
import type {
  ApiCategory,
  ApiManufacturerRef,
  ApiProduct,
  ApiProductDetail,
  ApiProductListResponse,
  ApiProductOffer,
  ApiProductSpecification,
  ApiSupplierBranch,
  ApiSupplierCard,
  ApiSupplierDetail,
  ApiSupplierListResponse,
  ApiSupplierRef,
} from '@/lib/types/catalog';
import { isPriceOnRequest } from '@/lib/format/search-table';

type SeedSupplierRow = { slug: string; name: string };
type SeedCategoryRow = { slug: string; name: string; parentId: null };
type SeedManufacturerRow = { slug: string; name: string };
type SeedProductRow = {
  slug: string;
  name: string;
  sku: string | null;
  article: string | null;
  price: string;
  priceOnRequest?: boolean;
  stockQuantity: number;
  lastUpdatedAt: string;
  supplierSlug: string;
  categorySlug: string;
  manufacturerSlug: string;
};

const SEED_SUPPLIERS: SeedSupplierRow[] = [
  { slug: 'ivanov-partners', name: 'ООО «Иванов и партнеры»' },
  { slug: 'ivanov-kompaniya', name: 'ООО «Иванов и Компания»' },
  { slug: 'electro-snab', name: 'ООО «ЭлектроСнаб»' },
  { slug: 'kabel-profi', name: 'ООО «КабельПрофи»' },
  { slug: 'svet-torg', name: 'ООО «СветТорг»' },
  { slug: 'elektrokomplekt', name: 'АО «Электрокомплект»' },
  { slug: 'moskabel', name: 'ООО «Москабель»' },
];

const SEED_CATEGORIES: SeedCategoryRow[] = [
  { slug: 'cable', name: 'Кабель и провод', parentId: null },
  { slug: 'equipment', name: 'Электрооборудование', parentId: null },
  { slug: 'switchgear', name: 'Распределительные устройства', parentId: null },
  { slug: 'lighting', name: 'Светотехника', parentId: null },
];

const SEED_MANUFACTURERS: SeedManufacturerRow[] = [
  { slug: 'elektrotechnika', name: 'Электротехника' },
  { slug: 'kabelny-zavod', name: 'Кабельный завод' },
  { slug: 'silovoy-kabel', name: 'Силовой кабель' },
  { slug: 'svyazka-shnur', name: 'Связка / шнур' },
  { slug: 'dekraft', name: 'DEKraft / аналог' },
  { slug: 'led-systems', name: 'LED Systems' },
  { slug: 'iek', name: 'IEK / аналог' },
  { slug: 'inkotex-merkuriy', name: 'Инкотекс / Меркурий' },
];

const SEED_PRODUCTS: SeedProductRow[] = [
  {
    slug: 'vvgng-ls-3x2-5',
    name: 'Кабель ВВГнг(А)-LS 3х2,5',
    sku: 'VGNG-3x2.5',
    article: '254634',
    price: '118.30',
    stockQuantity: 8000,
    lastUpdatedAt: '2026-02-17',
    supplierSlug: 'ivanov-partners',
    categorySlug: 'cable',
    manufacturerSlug: 'elektrotechnika',
  },
  {
    slug: 'vvgng-ls-3x1-5',
    name: 'Кабель ВВГнг(А)-LS 3х1,5',
    sku: 'VGNG-3x1.5',
    article: '254635',
    price: '89.50',
    stockQuantity: 12000,
    lastUpdatedAt: '2026-02-16',
    supplierSlug: 'ivanov-partners',
    categorySlug: 'cable',
    manufacturerSlug: 'elektrotechnika',
  },
  {
    slug: 'vvgng-ls-5x4',
    name: 'Кабель ВВГнг(А)-LS 5х4',
    sku: 'VGNG-5x4',
    article: '254640',
    price: '312.00',
    stockQuantity: 2100,
    lastUpdatedAt: '2026-02-15',
    supplierSlug: 'moskabel',
    categorySlug: 'cable',
    manufacturerSlug: 'kabelny-zavod',
  },
  {
    slug: 'vvg-3x2-5',
    name: 'Кабель ВВГ 3х2,5',
    sku: 'VVG-3x2.5',
    article: '301001',
    price: '72.40',
    stockQuantity: 15000,
    lastUpdatedAt: '2026-02-14',
    supplierSlug: 'kabel-profi',
    categorySlug: 'cable',
    manufacturerSlug: 'elektrotechnika',
  },
  {
    slug: 'avvg-4x120',
    name: 'Кабель АВВГ 4×120',
    sku: 'AVVG-4x120',
    article: '881201',
    price: '4520.00',
    priceOnRequest: true,
    stockQuantity: 400,
    lastUpdatedAt: '2026-02-10',
    supplierSlug: 'electro-snab',
    categorySlug: 'cable',
    manufacturerSlug: 'silovoy-kabel',
  },
  {
    slug: 'pvs-3x2-5',
    name: 'Провод ПВС 3х2,5',
    sku: 'PVS-3x2.5',
    article: '410022',
    price: '45.20',
    stockQuantity: 9000,
    lastUpdatedAt: '2026-02-12',
    supplierSlug: 'kabel-profi',
    categorySlug: 'cable',
    manufacturerSlug: 'svyazka-shnur',
  },
  {
    slug: 'puv-1x10',
    name: 'Провод ПуВ 1×10',
    sku: 'PUV-1x10',
    article: '410088',
    price: '128.00',
    stockQuantity: 3200,
    lastUpdatedAt: '2026-02-08',
    supplierSlug: 'moskabel',
    categorySlug: 'cable',
    manufacturerSlug: 'elektrotechnika',
  },
  {
    slug: 'avb-63a',
    name: 'Автоматический выключатель 63А',
    sku: 'MCB-63',
    article: '990011',
    price: '1240.00',
    stockQuantity: 250,
    lastUpdatedAt: '2026-01-28',
    supplierSlug: 'electro-snab',
    categorySlug: 'equipment',
    manufacturerSlug: 'dekraft',
  },
  {
    slug: 'avb-25a-b',
    name: 'Автоматический выключатель 25А, характеристика B',
    sku: 'MCB-25-B',
    article: '990012',
    price: '890.00',
    stockQuantity: 480,
    lastUpdatedAt: '2026-02-01',
    supplierSlug: 'elektrokomplekt',
    categorySlug: 'equipment',
    manufacturerSlug: 'iek',
  },
  {
    slug: 'kontaktor-40a',
    name: 'Контактор модульный 40А',
    sku: 'KM-40',
    article: '770055',
    price: '2150.00',
    stockQuantity: 120,
    lastUpdatedAt: '2026-01-20',
    supplierSlug: 'elektrokomplekt',
    categorySlug: 'equipment',
    manufacturerSlug: 'iek',
  },
  {
    slug: 'rubezh-12m',
    name: 'УЗО 2P 63А 30мА',
    sku: 'RCD-2P-63',
    article: '660033',
    price: '1890.00',
    stockQuantity: 95,
    lastUpdatedAt: '2026-02-05',
    supplierSlug: 'electro-snab',
    categorySlug: 'equipment',
    manufacturerSlug: 'dekraft',
  },
  {
    slug: 'schit-nakladnoy-12',
    name: 'Щит распределительный накладной на 12 модулей',
    sku: 'DB-12-S',
    article: '520100',
    price: '1450.00',
    stockQuantity: 200,
    lastUpdatedAt: '2026-02-11',
    supplierSlug: 'ivanov-partners',
    categorySlug: 'switchgear',
    manufacturerSlug: 'iek',
  },
  {
    slug: 'schit-vstraivaemyy-24',
    name: 'Щит встраиваемый на 24 модуля IP40',
    sku: 'DB-24-F',
    article: '520124',
    price: '2890.00',
    stockQuantity: 88,
    lastUpdatedAt: '2026-01-30',
    supplierSlug: 'elektrokomplekt',
    categorySlug: 'switchgear',
    manufacturerSlug: 'iek',
  },
  {
    slug: 'avr-63a',
    name: 'Автоматический ввод резерва 63А',
    sku: 'ATS-63',
    article: '530200',
    price: '12400.00',
    stockQuantity: 15,
    lastUpdatedAt: '2026-01-15',
    supplierSlug: 'elektrokomplekt',
    categorySlug: 'switchgear',
    manufacturerSlug: 'iek',
  },
  {
    slug: 'svetilnik-led-36w',
    name: 'Светильник LED панель 595×595 36 Вт 4000K',
    sku: 'LED-PAN-36',
    article: '610301',
    price: '1680.00',
    stockQuantity: 340,
    lastUpdatedAt: '2026-02-13',
    supplierSlug: 'svet-torg',
    categorySlug: 'lighting',
    manufacturerSlug: 'led-systems',
  },
  {
    slug: 'prozhektor-led-50w',
    name: 'Прожектор LED 50 Вт IP65',
    sku: 'FL-LED-50',
    article: '610450',
    price: '920.00',
    stockQuantity: 560,
    lastUpdatedAt: '2026-02-09',
    supplierSlug: 'svet-torg',
    categorySlug: 'lighting',
    manufacturerSlug: 'led-systems',
  },
  {
    slug: 'lampa-led-e27-10w',
    name: 'Лампа LED Е27 10 Вт 3000K',
    sku: 'LED-E27-10',
    article: '620011',
    price: '125.00',
    stockQuantity: 8000,
    lastUpdatedAt: '2026-02-17',
    supplierSlug: 'svet-torg',
    categorySlug: 'lighting',
    manufacturerSlug: 'led-systems',
  },
  {
    slug: 'kabel-nym-3x1-5',
    name: 'Кабель NYM 3×1,5',
    sku: 'NYM-3x1.5',
    article: '330501',
    price: '38.90',
    stockQuantity: 11000,
    lastUpdatedAt: '2026-02-06',
    supplierSlug: 'moskabel',
    categorySlug: 'cable',
    manufacturerSlug: 'elektrotechnika',
  },
  {
    slug: 'sip-4x16',
    name: 'Провод СИП-4 4×16',
    sku: 'SIP-4x16',
    article: '340120',
    price: '95.00',
    stockQuantity: 4200,
    lastUpdatedAt: '2026-02-04',
    supplierSlug: 'kabel-profi',
    categorySlug: 'cable',
    manufacturerSlug: 'silovoy-kabel',
  },
  {
    slug: 'transformato-630',
    name: 'Трансформатор силовой 630 кВА',
    sku: 'TR-630',
    article: '800001',
    price: '285000.00',
    priceOnRequest: true,
    stockQuantity: 3,
    lastUpdatedAt: '2025-12-01',
    supplierSlug: 'elektrokomplekt',
    categorySlug: 'equipment',
    manufacturerSlug: 'iek',
  },
  {
    slug: 'schetchik-merkuriy-201',
    name: 'Счётчик электроэнергии однофазный Меркурий 201',
    sku: 'M201',
    article: '710010',
    price: '2340.00',
    stockQuantity: 180,
    lastUpdatedAt: '2026-02-03',
    supplierSlug: 'ivanov-partners',
    categorySlug: 'equipment',
    manufacturerSlug: 'inkotex-merkuriy',
  },
  {
    slug: 'kabel-vbshv-3h16',
    name: 'Кабель ВБШв 3х16',
    sku: 'VVGNG-3x2.5',
    article: 'VVGNG-3x2.5',
    price: '118.30',
    stockQuantity: 8000,
    lastUpdatedAt: '2026-02-17',
    supplierSlug: 'ivanov-partners',
    categorySlug: 'cable',
    manufacturerSlug: 'elektrotechnika',
  },
];

type ProductDetailMockExt = {
  priceMax?: string | null;
  manufacturer?: string | null;
  description?: string | null;
  specifications?: ApiProductSpecification[];
  supplierCard?: Partial<Omit<ApiSupplierCard, 'slug'>>;
  offers?: ApiProductOffer[];
};

/** Синхронизируйте с `apps/api/src/catalog/product-detail.extensions.ts` → `PRODUCT_DETAIL_BY_SLUG`. */
const DESC_CABLE_PVC = `КОНСТРУКЦИЯ

Токопроводящая жила — медная, круглая или секторная, класс 1 или 2 по ГОСТ 22483. Изоляция и оболочка — из поливинилхлоридного пластиката (ПВХ).

ОБЛАСТЬ ПРИМЕНЕНИЯ

Для прокладки в сухих и влажных производственных помещениях, кабельных блоках и туннелях, внешних электроустановках. Номинальное переменное напряжение до 1 кВ частоты 50 Гц.`;

const DESC_AWG = `Силовой алюминиевый кабель с изоляцией и оболочкой из ПВХ. Жилы из электротехнического алюминия.

Прокладка одиночно или в пучках во взрыво- и пожаробезопасных зонах, в грунте, на открытом воздухе при отсутствии механических нагрузок.`;

const DESC_MCB = `Однополюсный / многополюсный автоматический выключатель с термомагнитным расцепителем. Класс тока отключения по ГОСТ IEC 60898-1.

Применение в распределительных щитах жилых и промышленных объектов для защиты от перегрузки и короткого замыкания.`;

const DESC_LED = `Светодиодная панель с равномерной засветкой, матовый рассеиватель. Срок службы LED-модуля до 50 000 ч.

Монтаж в подвесные потолки типа «Армстронг», офисы, торговые залы, образовательные учреждения.`;

const DESC_CONTACTOR = `Модульный контактор для дистанционного включения и отключения одно- и трёхфазных нагрузок. Категория применения AC-3, AC-1.

Установка на DIN-рейку в щитах управления и автоматизации.`;

/** Синхронизируйте с `apps/api/src/catalog/product-detail.extensions.ts` → `DESC_VBSHV`. */
const DESC_VBSHV = `Описание

КОНСТРУКЦИЯ КАБЕЛЯ ВБШв:

1- Токопроводящая жила – медная, однопроволочная или многопроволочная, круглой или секторной формы, 1 или 2 класса по ГОСТ 22483
2- Изоляция – из поливинилхлоридного пластиката (ПВХ). Скрутка – изолированные жилы скручены по конструкции кабеля.
3- Поясная изоляция – в кабелях из ПВХ пластиката.
4- Броня из стальных оцинкованных лент.
5- Шланг из ПВХ пластиката

ОБЛАСТЬ ПРИМЕНЕНИЯ КАБЕЛЯ ВБШв:

Для передачи и распределения электроэнергии в стационарных установках на номинальное переменное напряжение 660 В и 1000 В частоты 50 Гц. Для прокладки в земле (траншеях), сухих и влажных производственных помещениях, туннелях, каналах, шахтах, коллекторах, а также на открытом воздухе при отсутствии значительных растягивающих усилий.`;

const SPECS_VBSHV: ApiProductSpecification[] = [
  { label: 'Маркировка', value: 'ВБШв' },
  { label: 'Тип провода', value: 'Силовой' },
  { label: 'Сечение кабеля', value: 'Круглое' },
  { label: 'Тип изоляции', value: 'Поливинилхлоридный пластикат' },
  { label: 'Материал жил', value: 'Медь' },
  { label: 'Материал', value: 'Медный' },
  { label: 'Напряжение', value: '1 кВ' },
  { label: 'Тип изоляции', value: 'С ПВХ изоляцией' },
];

const CARD_ROMASHKA: ProductDetailMockExt['supplierCard'] = {
  companyName: 'ООО «Ромашка»',
  address: 'г. Москва, ул. Третьяковская 12',
  website: '2mkablo.com',
  phone: '+7 (495) 973-53-16',
  inn: '7720531382',
  innSourcesLine: 'Контур.Фокус · Sabby · ФНС · Чекко',
  onPortalSince: '1 год · с 12.01.2025',
};

const CARD_ELECTROSNAB: ProductDetailMockExt['supplierCard'] = {
  companyName: 'ООО «ЭлектроСнаб»',
  address: 'г. Санкт-Петербург, наб. реки Смоленки, д. 63',
  website: 'electro-snab.demo',
  phone: '+7 (812) 309-44-12',
  inn: '7801234567',
  innSourcesLine: 'Контур.Фокус · ФНС',
  onPortalSince: '3 года · с 01.06.2022',
};

const CARD_SVET_TORG: ProductDetailMockExt['supplierCard'] = {
  companyName: 'ООО «СветТорг»',
  address: 'г. Казань, ул. Декабристов, д. 2Б',
  website: 'svet-torg.demo',
  phone: '+7 (843) 555-77-01',
  inn: '1650123456',
  innSourcesLine: 'Контур.Фокус · Sabby · ФНС',
  onPortalSince: '8 мес. · с 01.07.2025',
};

const CARD_ELEKTROKOMPLEKT: ProductDetailMockExt['supplierCard'] = {
  companyName: 'АО «Электрокомплект»',
  address: 'г. Екатеринбург, ул. Экспертов, д. 7',
  website: 'elektrokomplekt.demo',
  phone: '+7 (343) 278-90-00',
  inn: '6685123456',
  innSourcesLine: 'Контур.Фокус · ФНС · Чекко',
  onPortalSince: '2 года · с 20.11.2023',
};

function cableSpecsBase(marking: string, crossSectionNote: string): ApiProductSpecification[] {
  return [
    { label: 'Маркировка', value: marking },
    { label: 'Тип провода', value: 'Силовой' },
    { label: 'Сечение / жилы', value: crossSectionNote },
    { label: 'Тип изоляции', value: 'Поливинилхлоридный пластикат' },
    { label: 'Материал жил', value: 'Медь' },
    { label: 'Материал', value: 'Медный' },
    { label: 'Напряжение', value: '1 кВ' },
    { label: 'Оболочка', value: 'ПВХ' },
  ];
}

function offersIvanovMoscowDup(price: string, stock: number, updated: string): ApiProductOffer[] {
  const row: ApiProductOffer = {
    supplierName: 'ООО «Иванов и партнеры»',
    supplierSlug: 'ivanov-partners',
    price,
    warehouseLines: ['г. Москва,', 'проспект Ленина 43'],
    stockQuantity: stock,
    minOrderQuantity: 100,
    lastUpdatedAt: updated,
    phone: '+7 (999) 999-99-99',
    email: 'pochta@mail.ru',
  };
  return [row, { ...row, supplierName: '' }];
}

function offersFigmaIvanovSeven(): ApiProductOffer[] {
  const row: ApiProductOffer = {
    supplierName: 'ООО «Иванов и партнеры»',
    supplierSlug: 'ivanov-partners',
    price: '118.30',
    warehouseLines: ['г.Москва,', 'проспект Ленина 43'],
    stockQuantity: 8000,
    minOrderQuantity: 100,
    lastUpdatedAt: '2026-02-17',
    phone: '+7 (999) 999-99-99',
    email: 'pochta@mail.ru',
    availabilityLine: '30 км',
  };
  return Array.from({ length: 7 }, () => ({ ...row }));
}

const PRODUCT_DETAIL_MOCK_EXT: Record<string, ProductDetailMockExt> = {
  'kabel-vbshv-3h16': {
    priceMax: '132.00',
    manufacturer: 'Электротехника',
    description: DESC_VBSHV,
    specifications: SPECS_VBSHV,
    supplierCard: CARD_ROMASHKA,
    offers: offersFigmaIvanovSeven(),
  },
  'vvgng-ls-3x2-5': {
    priceMax: '132.00',
    manufacturer: 'Электротехника',
    description: DESC_CABLE_PVC,
    specifications: cableSpecsBase('ВВГнг(А)-LS', '3×2,5 мм²'),
    supplierCard: CARD_ROMASHKA,
    offers: offersIvanovMoscowDup('118.30', 8000, '2026-02-17'),
  },
  'vvgng-ls-3x1-5': {
    priceMax: '105.00',
    manufacturer: 'Электротехника',
    description: DESC_CABLE_PVC,
    specifications: cableSpecsBase('ВВГнг(А)-LS', '3×1,5 мм²'),
    supplierCard: CARD_ROMASHKA,
    offers: [
      {
        supplierName: 'ООО «Иванов и партнеры»',
        supplierSlug: 'ivanov-partners',
        price: '89.50',
        warehouseLines: ['г. Москва,', 'ул. Складская 1'],
        stockQuantity: 12000,
        minOrderQuantity: 50,
        lastUpdatedAt: '2026-02-16',
        phone: '+7 (999) 999-99-99',
        email: 'pochta@mail.ru',
      },
      {
        supplierName: 'ООО «КабельПрофи»',
        supplierSlug: 'kabel-profi',
        price: '94.20',
        warehouseLines: ['г. Екатеринбург,', 'промзона Южная'],
        stockQuantity: 6400,
        minOrderQuantity: 200,
        lastUpdatedAt: '2026-02-15',
        phone: '+7 (922) 100-20-30',
        email: 'sales@kabel-profi.demo',
      },
    ],
  },
  'vvgng-ls-5x4': {
    priceMax: '340.00',
    manufacturer: 'Кабельный завод',
    description: DESC_CABLE_PVC,
    specifications: cableSpecsBase('ВВГнг(А)-LS', '5×4 мм²'),
    supplierCard: CARD_ROMASHKA,
    offers: [
      {
        supplierName: 'ООО «Москабель»',
        supplierSlug: 'moskabel',
        price: '312.00',
        warehouseLines: ['г. Москва,', 'Каширское ш. 3'],
        stockQuantity: 2100,
        minOrderQuantity: 100,
        lastUpdatedAt: '2026-02-15',
        phone: '+7 (495) 111-22-33',
        email: 'opt@moskabel.demo',
      },
      {
        supplierName: 'ООО «Иванов и партнеры»',
        supplierSlug: 'ivanov-partners',
        price: '325.00',
        warehouseLines: ['г. Москва,', 'проспект Ленина 43'],
        stockQuantity: 800,
        minOrderQuantity: 50,
        lastUpdatedAt: '2026-02-14',
        phone: '+7 (999) 999-99-99',
        email: 'pochta@mail.ru',
      },
    ],
  },
  'vvg-3x2-5': {
    priceMax: '88.00',
    manufacturer: 'Электротехника',
    description: DESC_CABLE_PVC,
    specifications: cableSpecsBase('ВВГ', '3×2,5 мм²'),
    supplierCard: CARD_ROMASHKA,
    offers: [
      {
        supplierName: 'ООО «КабельПрофи»',
        supplierSlug: 'kabel-profi',
        price: '72.40',
        warehouseLines: ['г. Екатеринбург,', 'промзона Южная'],
        stockQuantity: 15000,
        minOrderQuantity: 100,
        lastUpdatedAt: '2026-02-14',
        phone: '+7 (922) 100-20-30',
        email: 'sales@kabel-profi.demo',
      },
      {
        supplierName: 'ООО «Москабель»',
        supplierSlug: 'moskabel',
        price: '79.90',
        warehouseLines: ['г. Москва,', 'Каширское ш. 3'],
        stockQuantity: 4200,
        minOrderQuantity: 200,
        lastUpdatedAt: '2026-02-13',
        phone: '+7 (495) 111-22-33',
        email: 'opt@moskabel.demo',
      },
    ],
  },
  'avvg-4x120': {
    priceMax: '4850.00',
    manufacturer: 'Силовой кабель',
    description: DESC_AWG,
    specifications: [
      { label: 'Маркировка', value: 'АВВГ' },
      { label: 'Сечение жил', value: '4×120 мм²' },
      { label: 'Материал жил', value: 'Алюминий' },
      { label: 'Изоляция', value: 'ПВХ' },
      { label: 'Оболочка', value: 'ПВХ' },
      { label: 'Напряжение', value: '1 кВ' },
      { label: 'Температура эксплуатации', value: '−50…+50 °C' },
      { label: 'ГОСТ', value: '31996-2012' },
    ],
    supplierCard: CARD_ELECTROSNAB,
    offers: [
      {
        supplierName: 'ООО «ЭлектроСнаб»',
        supplierSlug: 'electro-snab',
        price: '4520.00',
        warehouseLines: ['г. Санкт-Петербург,', 'терминал «Южный»'],
        stockQuantity: 400,
        minOrderQuantity: 50,
        lastUpdatedAt: '2026-02-10',
        phone: '+7 (812) 309-44-12',
        email: 'zakaz@electro-snab.demo',
      },
      {
        supplierName: 'АО «Электрокомплект»',
        supplierSlug: 'elektrokomplekt',
        price: '4680.00',
        warehouseLines: ['г. Екатеринбург,', 'ул. Экспертов 7'],
        stockQuantity: 120,
        minOrderQuantity: 20,
        lastUpdatedAt: '2026-02-09',
        phone: '+7 (343) 278-90-00',
        email: 'opt@elektrokomplekt.demo',
      },
    ],
  },
  'pvs-3x2-5': {
    priceMax: '52.00',
    manufacturer: 'Связка / шнур',
    description:
      'Гибкий провод ПВС для подключения бытовой техники и переносных устройств. Изоляция и оболочка ПВХ.',
    specifications: [
      { label: 'Маркировка', value: 'ПВС' },
      { label: 'Число жил × сечение', value: '3×2,5 мм²' },
      { label: 'Класс гибкости', value: '5 по ГОСТ 22483' },
      { label: 'Напряжение', value: '450/750 В' },
      { label: 'Материал жил', value: 'Медь' },
      { label: 'Цвет жил', value: 'сине-зелёный, коричневый, чёрный' },
    ],
    supplierCard: CARD_ROMASHKA,
    offers: [
      {
        supplierName: 'ООО «КабельПрофи»',
        supplierSlug: 'kabel-profi',
        price: '45.20',
        warehouseLines: ['г. Екатеринбург,', 'промзона Южная'],
        stockQuantity: 9000,
        minOrderQuantity: 500,
        lastUpdatedAt: '2026-02-12',
        phone: '+7 (922) 100-20-30',
        email: 'sales@kabel-profi.demo',
      },
    ],
  },
  'avb-63a': {
    priceMax: '1380.00',
    manufacturer: 'DEKraft / аналог',
    description: DESC_MCB,
    specifications: [
      { label: 'Номинальный ток', value: '63 А' },
      { label: 'Характеристика расцепителя', value: 'C' },
      { label: 'Полюса', value: '3P' },
      { label: 'Номинальное напряжение', value: '400 В' },
      { label: 'Отключающая способность', value: '6 кА' },
      { label: 'Монтаж', value: 'DIN-рейка 35 мм' },
      { label: 'Степень защиты', value: 'IP20' },
    ],
    supplierCard: CARD_ELEKTROKOMPLEKT,
    offers: [
      {
        supplierName: 'АО «Электрокомплект»',
        supplierSlug: 'elektrokomplekt',
        price: '1240.00',
        warehouseLines: ['г. Екатеринбург,', 'ул. Экспертов 7'],
        stockQuantity: 250,
        minOrderQuantity: 10,
        lastUpdatedAt: '2026-01-28',
        phone: '+7 (343) 278-90-00',
        email: 'opt@elektrokomplekt.demo',
      },
      {
        supplierName: 'ООО «ЭлектроСнаб»',
        supplierSlug: 'electro-snab',
        price: '1295.00',
        warehouseLines: ['г. Санкт-Петербург,', 'наб. реки Смоленки 63'],
        stockQuantity: 180,
        minOrderQuantity: 5,
        lastUpdatedAt: '2026-01-27',
        phone: '+7 (812) 309-44-12',
        email: 'zakaz@electro-snab.demo',
      },
    ],
  },
  'svetilnik-led-36w': {
    priceMax: '1820.00',
    manufacturer: 'LED Systems',
    description: DESC_LED,
    specifications: [
      { label: 'Тип', value: 'LED-панель' },
      { label: 'Мощность', value: '36 Вт' },
      { label: 'Размер корпуса', value: '595×595 мм' },
      { label: 'Цветовая температура', value: '4000 K' },
      { label: 'Световой поток', value: '3600 лм' },
      { label: 'Индекс цветопередачи', value: 'Ra > 80' },
      { label: 'Срок службы', value: '50 000 ч' },
      { label: 'Класс защиты', value: 'IP40' },
    ],
    supplierCard: CARD_SVET_TORG,
    offers: [
      {
        supplierName: 'ООО «СветТорг»',
        supplierSlug: 'svet-torg',
        price: '1680.00',
        warehouseLines: ['г. Казань,', 'склад «Восток»'],
        stockQuantity: 340,
        minOrderQuantity: 4,
        lastUpdatedAt: '2026-02-13',
        phone: '+7 (843) 555-77-01',
        email: 'order@svet-torg.demo',
      },
      {
        supplierName: 'ООО «Иванов и партнеры»',
        supplierSlug: 'ivanov-partners',
        price: '1750.00',
        warehouseLines: ['г. Москва,', 'проспект Ленина 43'],
        stockQuantity: 95,
        minOrderQuantity: 2,
        lastUpdatedAt: '2026-02-12',
        phone: '+7 (999) 999-99-99',
        email: 'pochta@mail.ru',
      },
    ],
  },
  'kontaktor-40a': {
    priceMax: '2280.00',
    manufacturer: 'IEK / аналог',
    description: DESC_CONTACTOR,
    specifications: [
      { label: 'Номинальный ток', value: '40 А' },
      { label: 'Напряжение катушки', value: '230 В AC' },
      { label: 'Категория применения', value: 'AC-3, AC-1' },
      { label: 'Количество полюсов', value: '3P + 1НО' },
      { label: 'Монтаж', value: 'DIN-рейка' },
      { label: 'Климатическое исполнение', value: 'УХЛ4' },
    ],
    supplierCard: CARD_ELEKTROKOMPLEKT,
    offers: [
      {
        supplierName: 'АО «Электрокомплект»',
        supplierSlug: 'elektrokomplekt',
        price: '2150.00',
        warehouseLines: ['г. Екатеринбург,', 'ул. Экспертов 7'],
        stockQuantity: 120,
        minOrderQuantity: 5,
        lastUpdatedAt: '2026-01-20',
        phone: '+7 (343) 278-90-00',
        email: 'opt@elektrokomplekt.demo',
      },
    ],
  },
};

function defaultOffersFromProduct(p: ApiProduct): ApiProductOffer[] {
  return [
    {
      supplierName: p.supplier.name,
      supplierSlug: p.supplier.slug,
      price: p.price,
      warehouseLines: ['г. Москва, склад'],
      stockQuantity: p.stockQuantity,
      minOrderQuantity: 100,
      lastUpdatedAt: p.lastUpdatedAt,
      phone: null,
      email: null,
    },
  ];
}

function toProductDetail(p: ApiProduct): ApiProductDetail {
  const ext = PRODUCT_DETAIL_MOCK_EXT[p.slug] ?? {};
  const specifications = ext.specifications ?? [];
  const manufacturer = ext.manufacturer ?? p.manufacturer?.name ?? null;
  const supplierCard: ApiSupplierCard = {
    companyName: ext.supplierCard?.companyName ?? p.supplier.name,
    slug: p.supplier.slug,
    address: ext.supplierCard?.address ?? null,
    website: ext.supplierCard?.website ?? null,
    phone: ext.supplierCard?.phone ?? null,
    inn: ext.supplierCard?.inn ?? null,
    innSourcesLine: ext.supplierCard?.innSourcesLine ?? null,
    onPortalSince: ext.supplierCard?.onPortalSince ?? null,
    onPortalBadge: ext.supplierCard?.onPortalBadge ?? null,
  };
  const offers = ext.offers?.length ? ext.offers : defaultOffersFromProduct(p);

  return {
    ...p,
    priceMax: ext.priceMax ?? null,
    manufacturer,
    description: ext.description ?? null,
    specifications,
    supplierCard,
    offers,
  };
}

/** Синхронизируйте с `apps/api/src/catalog/supplier-detail.extensions.ts` → `SUPPLIER_DETAIL_BY_SLUG`. */
type SupplierDetailMockExt = {
  legalAddress?: string | null;
  website?: string | null;
  inn?: string | null;
  innSourcesLine?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  branches?: ApiSupplierBranch[];
  description?: string | null;
};

const DESC_SUPPLIER_IVANOV_KOMPANIYA = `Описание

КОНСТРУКЦИЯ КАБЕЛЯ ВБШв:

1- Токопроводящая жила – медная, однопроволочная или многопроволочная, круглой или секторной формы, 1 или 2 класса по ГОСТ 22483
2- Изоляция – из поливинилхлоридного пластиката (ПВХ). Скрутка – изолированные жилы двух-, трех-, четырех-и пятижильных кабелей скручены; двухжильные кабели имеют жилы одинакового сечения, трех-, четырех- и пятижильные имеют все жилы одинакового сечения или одну жилу меньшего сечения (жилу заземления или нулевую).`;

const BRANCH_PERM_MOCK: ApiSupplierBranch = {
  city: 'Пермь',
  address: 'ул. Ольховская, д. 19',
  hoursWeekday: 'Пн-пт: 09:00–21:00',
  hoursWeekend: 'Сб-вс: 10:00–20:00',
  productCount: 10,
};

const BRANCH_MSK_MOCK: ApiSupplierBranch = {
  city: 'Москва',
  address: 'ул. Электрозаводская, д. 21, стр. 3',
  hoursWeekday: 'Пн–пт: 09:00–18:00',
  hoursWeekend: 'Сб: 10:00–16:00, вс: выходной',
  productCount: 24,
};

const BRANCH_SPB_MOCK: ApiSupplierBranch = {
  city: 'Санкт-Петербург',
  address: 'пр. Обуховской Обороны, д. 120, лит. А',
  hoursWeekday: 'Пн–пт: 08:30–17:30',
  hoursWeekend: 'Сб–вс: выходной',
  productCount: 18,
};

const BRANCH_KZN_MOCK: ApiSupplierBranch = {
  city: 'Казань',
  address: 'ул. Восстания, д. 100, оф. 12',
  hoursWeekday: 'Пн–пт: 10:00–19:00',
  hoursWeekend: 'Сб: 11:00–17:00, вс: выходной',
  productCount: 14,
};

const BRANCH_NN_MOCK: ApiSupplierBranch = {
  city: 'Нижний Новгород',
  address: 'ул. Рождественская, д. 38',
  hoursWeekday: 'Пн–пт: 09:00–18:00',
  hoursWeekend: 'Сб–вс: по договорённости',
  productCount: 9,
};

const BRANCH_EKB_MOCK: ApiSupplierBranch = {
  city: 'Екатеринбург',
  address: 'ул. Малышева, д. 5',
  hoursWeekday: 'Пн–пт: 09:00–18:00',
  hoursWeekend: 'Сб: 10:00–15:00, вс: выходной',
  productCount: 31,
};

const DESC_SUPPLIER_SHORT = (tagline: string) =>
  `${tagline}\n\nПоставщик в каталоге «Электротехника»: кабель, провод, низковольтное оборудование. Работаем с юридическими лицами, отгрузка со складов в регионе присутствия.`;

const SUPPLIER_DETAIL_MOCK_EXT: Record<string, SupplierDetailMockExt> = {
  'ivanov-partners': {
    legalAddress: '105120, г. Москва, ул. Золоторожский Вал, д. 11',
    website: 'https://ivanov-partners.example',
    inn: '7707123456',
    innSourcesLine: 'Контур.Фокус · Sabby · ФНС · Чекко',
    contactPerson: 'Мария Ивановна Петрова',
    phone: '+7 (495) 123-45-67',
    email: 'sales@ivanov-partners.example',
    branches: [BRANCH_MSK_MOCK, BRANCH_PERM_MOCK],
    description: DESC_SUPPLIER_SHORT('ООО «Иванов и партнеры» — оптовые поставки кабельно-проводниковой продукции.'),
  },
  'ivanov-kompaniya': {
    legalAddress: '614047, г. Пермь, ул. Ольховская, д. 7',
    website: 'https://pbkab.ru',
    inn: '5903123193',
    innSourcesLine: 'ФНС · Контур.Фокус · Saby · Чекко',
    contactPerson: 'Артём Сергеевич Агалаков',
    phone: '+7 (342) 275-57-71',
    email: 'zakaz@s-kabel.ru',
    branches: [BRANCH_PERM_MOCK, BRANCH_PERM_MOCK, BRANCH_PERM_MOCK],
    description: DESC_SUPPLIER_IVANOV_KOMPANIYA,
  },
  'electro-snab': {
    legalAddress: '192007, г. Санкт-Петербург, Лиговский пр., д. 50',
    website: 'https://electro-snab.example',
    inn: '7801567890',
    innSourcesLine: 'Контур.Фокус · ФНС · Чекко',
    contactPerson: 'Дмитрий Олегович Смирнов',
    phone: '+7 (812) 555-01-02',
    email: 'zakaz@electro-snab.example',
    branches: [BRANCH_SPB_MOCK],
    description: DESC_SUPPLIER_SHORT('ООО «ЭлектроСнаб» — комплексные поставки для монтажных и проектных организаций.'),
  },
  'kabel-profi': {
    legalAddress: '115088, г. Москва, 2-й Южнопортовый пр., д. 16',
    website: 'https://kabel-profi.example',
    inn: '7708234567',
    innSourcesLine: 'Контур.Фокус · Sabby · ФНС',
    contactPerson: 'Елена Викторовна Козлова',
    phone: '+7 (495) 987-65-43',
    email: 'opt@kabel-profi.example',
    branches: [BRANCH_MSK_MOCK, BRANCH_KZN_MOCK],
    description: DESC_SUPPLIER_SHORT('ООО «КабельПрофи» — складские позиции силового и монтажного кабеля.'),
  },
  'svet-torg': {
    legalAddress: '603001, г. Нижний Новгород, ул. Большая Печёрская, д. 47',
    website: 'https://svet-torg.example',
    inn: '5260987654',
    innSourcesLine: 'ФНС · Чекко',
    contactPerson: 'Андрей Павлович Лебедев',
    phone: '+7 (831) 234-56-78',
    email: 'info@svet-torg.example',
    branches: [BRANCH_NN_MOCK],
    description: DESC_SUPPLIER_SHORT('ООО «СветТорг» — светотехника и комплектующие для объектов любого масштаба.'),
  },
  'elektrokomplekt': {
    legalAddress: '115230, г. Москва, Варшавское ш., д. 1, стр. 6',
    website: 'https://elektrokomplekt.example',
    inn: '7709345678',
    innSourcesLine: 'Контур.Фокус · ФНС · Saby · Чекко',
    contactPerson: 'Ирина Николаевна Волкова',
    phone: '+7 (495) 111-22-33',
    email: 'b2b@elektrokomplekt.example',
    branches: [BRANCH_MSK_MOCK, BRANCH_EKB_MOCK],
    description: DESC_SUPPLIER_SHORT('АО «Электрокомплект» — низковольтное оборудование и автоматика.'),
  },
  'moskabel': {
    legalAddress: '127322, г. Москва, ул. Сущёвский Вал, д. 5',
    website: 'https://moskabel.example',
    inn: '7710456789',
    innSourcesLine: 'Контур.Фокус · ФНС',
    contactPerson: 'Сергей Александрович Орлов',
    phone: '+7 (495) 444-55-66',
    email: 'sales@moskabel.example',
    branches: [BRANCH_MSK_MOCK],
    description: DESC_SUPPLIER_SHORT('ООО «Москабель» — кабельная продукция для строительства и промышленности.'),
  },
};

function supplierRefFromSeed(s: SeedSupplierRow): ApiSupplierRef {
  const id = `mock-s-${s.slug}`;
  const ext = SUPPLIER_DETAIL_MOCK_EXT[s.slug] ?? {};
  const cities = [...new Set((ext.branches ?? []).map((b) => b.city))];
  return {
    id,
    slug: s.slug,
    name: s.name,
    inn: ext.inn ?? null,
    warehouseCitiesLine: cities.length ? cities.join(', ') : null,
    website: ext.website ?? null,
    phone: ext.phone ?? null,
    emailsLine: ext.email ?? null,
    otherLine: ext.innSourcesLine ?? null,
  };
}

function toSupplierDetail(s: ApiSupplierRef): ApiSupplierDetail {
  const ext = SUPPLIER_DETAIL_MOCK_EXT[s.slug] ?? {};
  return {
    ...s,
    legalAddress: ext.legalAddress ?? null,
    website: ext.website ?? null,
    inn: ext.inn ?? null,
    innSourcesLine: ext.innSourcesLine ?? null,
    contactPerson: ext.contactPerson ?? null,
    phone: ext.phone ?? null,
    email: ext.email ?? null,
    branches: ext.branches ?? [],
    description: ext.description ?? null,
  };
}

type CatalogCache = {
  categories: ApiCategory[];
  suppliers: ApiSupplierRef[];
  products: ApiProduct[];
  manufacturers: ApiManufacturerRef[];
};

let cache: CatalogCache | null = null;

function getCatalog(): CatalogCache {
  if (cache) {
    return cache;
  }
  const categories: ApiCategory[] = SEED_CATEGORIES.map((c) => ({
    id: `mock-c-${c.slug}`,
    slug: c.slug,
    name: c.name,
    parentId: null,
  }));
  const suppliers: ApiSupplierRef[] = SEED_SUPPLIERS.map((s) => supplierRefFromSeed(s));
  const supplierBySlug = Object.fromEntries(suppliers.map((s) => [s.slug, s])) as Record<
    string,
    ApiSupplierRef
  >;
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
    string,
    ApiCategory
  >;

  const manufacturers: ApiManufacturerRef[] = SEED_MANUFACTURERS.map((m) => ({
    id: `mock-m-${m.slug}`,
    slug: m.slug,
    name: m.name,
  }));
  const manufacturerBySlug = Object.fromEntries(manufacturers.map((m) => [m.slug, m])) as Record<
    string,
    ApiManufacturerRef
  >;

  const products: ApiProduct[] = SEED_PRODUCTS.map((row) => {
    const supplier = supplierBySlug[row.supplierSlug];
    const cat = categoryBySlug[row.categorySlug];
    const manufacturer = manufacturerBySlug[row.manufacturerSlug];
    if (!supplier) {
      throw new Error(`catalog-dev-mock: unknown supplierSlug ${row.supplierSlug}`);
    }
    if (!manufacturer) {
      throw new Error(`catalog-dev-mock: unknown manufacturerSlug ${row.manufacturerSlug}`);
    }
    return {
      id: `mock-p-${row.slug}`,
      slug: row.slug,
      name: row.name,
      sku: row.sku,
      article: row.article,
      price: row.priceOnRequest === true ? 'По запросу' : row.price,
      stockQuantity: row.stockQuantity,
      lastUpdatedAt: row.lastUpdatedAt,
      supplier,
      category: cat
        ? { id: cat.id, slug: cat.slug, name: cat.name }
        : null,
      manufacturer,
    };
  });

  cache = { categories, suppliers, products, manufacturers };
  return cache;
}

function parsePath(path: string): { pathname: string; searchParams: URLSearchParams } {
  const q = path.indexOf('?');
  const pathname = q === -1 ? path : path.slice(0, q);
  const search = q === -1 ? '' : path.slice(q + 1);
  return { pathname, searchParams: new URLSearchParams(search) };
}

function matchesProductSearch(p: ApiProduct, term: string): boolean {
  const t = term.trim().toLowerCase();
  if (!t) {
    return true;
  }
  const name = p.name.toLowerCase();
  const sku = (p.sku ?? '').toLowerCase();
  return name.includes(t) || sku.includes(t);
}

function priceNumeric(p: ApiProduct): number {
  return Number.parseFloat(p.price);
}

function compareByPriceAsc(a: ApiProduct, b: ApiProduct): number {
  const ar = isPriceOnRequest(a.price);
  const br = isPriceOnRequest(b.price);
  if (ar !== br) {
    return ar ? 1 : -1;
  }
  return priceNumeric(a) - priceNumeric(b) || a.name.localeCompare(b.name, 'ru');
}

function compareByPriceDesc(a: ApiProduct, b: ApiProduct): number {
  const ar = isPriceOnRequest(a.price);
  const br = isPriceOnRequest(b.price);
  if (ar !== br) {
    return ar ? 1 : -1;
  }
  return priceNumeric(b) - priceNumeric(a) || a.name.localeCompare(b.name, 'ru');
}

function updatedTime(p: ApiProduct): number {
  if (!p.lastUpdatedAt) {
    return 0;
  }
  const t = Date.parse(p.lastUpdatedAt);
  return Number.isNaN(t) ? 0 : t;
}

const MOCK_SORT_KEYS = new Set([
  'price_asc',
  'price_desc',
  'stock_asc',
  'stock_desc',
  'updated_asc',
  'updated_desc',
]);

function listProductsMock(sp: URLSearchParams): ApiProductListResponse {
  const { products } = getCatalog();
  const q = sp.get('q') ?? '';
  const category = sp.get('category')?.trim() ?? '';
  const manufacturer = sp.get('manufacturer')?.trim() ?? '';
  const supplier = sp.get('supplier')?.trim() ?? '';
  const rawSort = sp.get('sort') ?? 'price_asc';
  const sort = MOCK_SORT_KEYS.has(rawSort) ? rawSort : 'price_asc';
  const limit = Math.min(100, Math.max(1, Number.parseInt(sp.get('limit') ?? '20', 10) || 20));
  const offset = Math.max(0, Number.parseInt(sp.get('offset') ?? '0', 10) || 0);

  const priceMin = sp.get('priceMin');
  const priceMax = sp.get('priceMax');
  const minStock = sp.get('minStock');
  const updatedFrom = sp.get('updatedFrom')?.trim() ?? '';
  const availability = sp.get('availability') ?? '';
  const exclRaw = (sp.get('excludeOnRequest') ?? '').trim().toLowerCase();
  const excludeOnRequest = exclRaw === '1' || exclRaw === 'true';

  let rows = products.filter((p) => matchesProductSearch(p, q));
  if (category) {
    rows = rows.filter((p) => p.category?.slug === category);
  }
  if (manufacturer) {
    rows = rows.filter((p) => p.manufacturer?.slug === manufacturer);
  }
  if (supplier) {
    rows = rows.filter((p) => p.supplier.slug === supplier);
  }
  if (excludeOnRequest) {
    rows = rows.filter((p) => !isPriceOnRequest(p.price));
  }
  if (priceMin !== null && priceMin !== '' && !Number.isNaN(Number.parseFloat(priceMin))) {
    const mn = Number.parseFloat(priceMin);
    rows = rows.filter((p) => !isPriceOnRequest(p.price) && priceNumeric(p) >= mn);
  }
  if (priceMax !== null && priceMax !== '' && !Number.isNaN(Number.parseFloat(priceMax))) {
    const mx = Number.parseFloat(priceMax);
    rows = rows.filter((p) => !isPriceOnRequest(p.price) && priceNumeric(p) <= mx);
  }
  if (minStock !== null && minStock !== '' && !Number.isNaN(Number.parseInt(minStock, 10))) {
    const ms = Number.parseInt(minStock, 10);
    rows = rows.filter((p) => (p.stockQuantity ?? 0) >= ms);
  }
  if (updatedFrom) {
    rows = rows.filter((p) => {
      if (!p.lastUpdatedAt) {
        return false;
      }
      return p.lastUpdatedAt >= updatedFrom;
    });
  }
  if (availability === 'in_stock') {
    rows = rows.filter((p) => (p.stockQuantity ?? 0) > 0);
  } else if (availability === 'on_order') {
    rows = rows.filter((p) => (p.stockQuantity ?? 0) === 0);
  }

  const total = rows.length;
  const sorted = [...rows];
  switch (sort) {
    case 'price_desc':
      sorted.sort(compareByPriceDesc);
      break;
    case 'stock_asc':
      sorted.sort(
        (a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0) || a.name.localeCompare(b.name, 'ru'),
      );
      break;
    case 'stock_desc':
      sorted.sort(
        (a, b) => (b.stockQuantity ?? 0) - (a.stockQuantity ?? 0) || a.name.localeCompare(b.name, 'ru'),
      );
      break;
    case 'updated_asc':
      sorted.sort(
        (a, b) => updatedTime(a) - updatedTime(b) || a.name.localeCompare(b.name, 'ru'),
      );
      break;
    case 'updated_desc':
      sorted.sort(
        (a, b) => updatedTime(b) - updatedTime(a) || a.name.localeCompare(b.name, 'ru'),
      );
      break;
    default:
      sorted.sort(compareByPriceAsc);
  }
  const items = sorted.slice(offset, offset + limit);
  return { items, total };
}

function listSuppliersMock(sp: URLSearchParams): ApiSupplierListResponse {
  const { suppliers, products } = getCatalog();
  const q = (sp.get('q') ?? '').trim().toLowerCase();
  const category = (sp.get('category') ?? '').trim();
  const warehouse = (sp.get('warehouse') ?? '').trim();
  const sort = sp.get('sort') === 'name_desc' ? 'name_desc' : 'name_asc';
  const limit = Math.min(100, Math.max(1, Number.parseInt(sp.get('limit') ?? '20', 10) || 20));
  const offset = Math.max(0, Number.parseInt(sp.get('offset') ?? '0', 10) || 0);

  let rows = suppliers;
  if (q) {
    rows = rows.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.inn ?? '').toLowerCase().includes(q),
    );
  }
  if (category) {
    const slugs = new Set(
      products.filter((p) => p.category?.slug === category).map((p) => p.supplier.slug),
    );
    rows = rows.filter((s) => slugs.has(s.slug));
  }
  if (warehouse) {
    const w = warehouse.toLowerCase();
    rows = rows.filter((s) =>
      (s.warehouseCitiesLine ?? '')
        .toLowerCase()
        .split(',')
        .some((c) => c.trim() === w),
    );
  }
  rows = [...rows].sort((a, b) => {
    const c = a.name.localeCompare(b.name, 'ru');
    return sort === 'name_desc' ? -c : c;
  });
  const total = rows.length;
  const items = rows.slice(offset, offset + limit);
  return { items, total };
}

export function isCatalogDevMockEnabled(): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  const v = process.env['NEXT_PUBLIC_USE_REAL_API'];
  if (v === '1' || v === 'true') {
    return false;
  }
  return true;
}

export type CatalogDevMockResult =
  | { kind: 'data'; body: unknown }
  | { kind: 'notFound' }
  | { kind: 'miss' };

function productPriceFilterMetaFromSeed(): { priceMax: number } {
  const listed = SEED_PRODUCTS.filter((r) => r.priceOnRequest !== true).map((r) =>
    Number.parseFloat(r.price),
  );
  const nums = listed.filter((x) => Number.isFinite(x) && x > 0);
  const pool =
    nums.length > 0
      ? nums
      : SEED_PRODUCTS.map((r) => Number.parseFloat(r.price)).filter((x) => Number.isFinite(x) && x > 0);
  const m = pool.length > 0 ? Math.max(...pool) : 0;
  if (m <= 0) {
    return { priceMax: 99000 };
  }
  return { priceMax: Math.max(1, Math.ceil(m)) };
}

/** Ответ мока по пути без учёта env (для fallback, когда реальный API в dev недоступен). */
export function resolveCatalogDevMockFromPath(path: string): CatalogDevMockResult {
  const { pathname, searchParams } = parsePath(path.startsWith('/') ? path : `/${path}`);

  if (pathname === '/product-price-filter-meta') {
    return { kind: 'data', body: productPriceFilterMetaFromSeed() };
  }

  if (pathname === '/categories') {
    return { kind: 'data', body: getCatalog().categories };
  }

  if (pathname === '/manufacturers') {
    return { kind: 'data', body: getCatalog().manufacturers };
  }

  if (pathname === '/products') {
    return { kind: 'data', body: listProductsMock(searchParams) };
  }

  if (pathname.startsWith('/products/')) {
    const slug = decodeURIComponent(pathname.slice('/products/'.length));
    const p = getCatalog().products.find((x) => x.slug === slug);
    return p ? { kind: 'data', body: toProductDetail(p) } : { kind: 'notFound' };
  }

  if (pathname === '/suppliers') {
    return { kind: 'data', body: listSuppliersMock(searchParams) };
  }

  if (pathname.startsWith('/suppliers/')) {
    const slug = decodeURIComponent(pathname.slice('/suppliers/'.length));
    const s = getCatalog().suppliers.find((x) => x.slug === slug);
    return s ? { kind: 'data', body: toSupplierDetail(s) } : { kind: 'notFound' };
  }

  return { kind: 'miss' };
}

export function tryCatalogDevMockResponse(path: string): CatalogDevMockResult {
  if (!isCatalogDevMockEnabled()) {
    return { kind: 'miss' };
  }
  return resolveCatalogDevMockFromPath(path);
}
