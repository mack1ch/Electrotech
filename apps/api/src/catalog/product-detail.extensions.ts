/**
 * Расширенные поля карточки товара — источник для сидов в БД (`CatalogSeedService`).
 * В рантайме API читает колонки `Product.*`, а не этот объект.
 * Макет: Figma «карточка товара — вид с таблицей» (0:3351).
 */
export type ProductDetailSpec = { label: string; value: string };

export type ProductDetailOfferSeed = {
  supplierName: string;
  supplierSlug: string;
  price: string;
  warehouseLines: string[];
  stockQuantity: number;
  minOrderQuantity: number | null;
  lastUpdatedAt: string | null;
  phone: string | null;
  email: string | null;
  /** Мобильный макет: строка под «Наличие» (напр. «30 км»). */
  availabilityLine?: string | null;
};

/** Соответствует web `SupplierPortalBadge` (иконки Figma 25:329 / 25:337 / 25:345). */
export type SupplierPortalBadge = 'verified' | 'active' | 'new';

export type ProductDetailSupplierCardSeed = {
  companyName?: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  inn: string | null;
  innSourcesLine: string | null;
  onPortalSince: string | null;
  onPortalBadge?: SupplierPortalBadge | null;
};

export type ProductDetailExtension = {
  priceMax?: string | null;
  /** Необязательная подмена подписи производителя поверх значения из БД (`products.manufacturer_id`). */
  manufacturer?: string | null;
  description?: string | null;
  specifications?: ProductDetailSpec[];
  supplierCard?: Partial<ProductDetailSupplierCardSeed>;
  offers?: ProductDetailOfferSeed[];
};

const CARD_ROMASHKA: ProductDetailSupplierCardSeed = {
  companyName: 'ООО «Ромашка»',
  address: 'г. Москва, ул. Третьяковская 12',
  website: '2mkablo.com',
  phone: '+7 (495) 973-53-16',
  inn: '7720531382',
  innSourcesLine: 'Контур.Фокус · Sabby · ФНС · Чекко',
  onPortalSince: '1 год · с 12.01.2025',
};

const CARD_ELECTROSNAB: ProductDetailSupplierCardSeed = {
  companyName: 'ООО «ЭлектроСнаб»',
  address: 'г. Санкт-Петербург, наб. реки Смоленки, д. 63',
  website: 'electro-snab.demo',
  phone: '+7 (812) 309-44-12',
  inn: '7801234567',
  innSourcesLine: 'Контур.Фокус · ФНС',
  onPortalSince: '3 года · с 01.06.2022',
};

const CARD_SVET_TORG: ProductDetailSupplierCardSeed = {
  companyName: 'ООО «СветТорг»',
  address: 'г. Казань, ул. Декабристов, д. 2Б',
  website: 'svet-torg.demo',
  phone: '+7 (843) 555-77-01',
  inn: '1650123456',
  innSourcesLine: 'Контур.Фокус · Sabby · ФНС',
  onPortalSince: '8 мес. · с 01.07.2025',
};

const CARD_ELEKTROKOMPLEKT: ProductDetailSupplierCardSeed = {
  companyName: 'АО «Электрокомплект»',
  address: 'г. Екатеринбург, ул. Экспертов, д. 7',
  website: 'elektrokomplekt.demo',
  phone: '+7 (343) 278-90-00',
  inn: '6685123456',
  innSourcesLine: 'Контур.Фокус · ФНС · Чекко',
  onPortalSince: '2 года · с 20.11.2023',
};

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

/** Figma «карточка товара» 0:3351 — блок «Описание». */
const DESC_VBSHV = `Описание

КОНСТРУКЦИЯ КАБЕЛЯ ВБШв:

1- Токопроводящая жила – медная, однопроволочная или многопроволочная, круглой или секторной формы, 1 или 2 класса по ГОСТ 22483
2- Изоляция – из поливинилхлоридного пластиката (ПВХ). Скрутка – изолированные жилы скручены по конструкции кабеля.
3- Поясная изоляция – в кабелях из ПВХ пластиката.
4- Броня из стальных оцинкованных лент.
5- Шланг из ПВХ пластиката

ОБЛАСТЬ ПРИМЕНЕНИЯ КАБЕЛЯ ВБШв:

Для передачи и распределения электроэнергии в стационарных установках на номинальное переменное напряжение 660 В и 1000 В частоты 50 Гц. Для прокладки в земле (траншеях), сухих и влажных производственных помещениях, туннелях, каналах, шахтах, коллекторах, а также на открытом воздухе при отсутствии значительных растягивающих усилий.`;

const SPECS_VBSHV: ProductDetailSpec[] = [
  { label: 'Маркировка', value: 'ВБШв' },
  { label: 'Тип провода', value: 'Силовой' },
  { label: 'Сечение кабеля', value: 'Круглое' },
  { label: 'Тип изоляции', value: 'Поливинилхлоридный пластикат' },
  { label: 'Материал жил', value: 'Медь' },
  { label: 'Материал', value: 'Медный' },
  { label: 'Напряжение', value: '1 кВ' },
  { label: 'Тип изоляции', value: 'С ПВХ изоляцией' },
];

function cableSpecsBase(marking: string, crossSectionNote: string): ProductDetailSpec[] {
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

function offersIvanovMoscowDup(price: string, stock: number, updated: string): ProductDetailOfferSeed[] {
  const row: ProductDetailOfferSeed = {
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

/** Figma 0:3351 / 0:3609 — семь одинаковых строк в блоке «Лучшие предложения». */
function offersFigmaIvanovSeven(): ProductDetailOfferSeed[] {
  const row: ProductDetailOfferSeed = {
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

export const PRODUCT_DETAIL_BY_SLUG: Record<string, ProductDetailExtension> = {
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
    manufacturer: 'Связька / шнур',
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
