/**
 * Расширенные поля карточки поставщика для GET /suppliers/:slug.
 * Макеты: Figma «карточка поставщика» 0:5722 (desktop), 0:5820 (mobile).
 *
 * Web dev-мок: `apps/web/src/lib/mocks/catalog-dev-mock.ts` → `SUPPLIER_DETAIL_MOCK_EXT`.
 */
export type SupplierBranchSeed = {
  city: string;
  address: string;
  hoursWeekday: string;
  hoursWeekend: string;
  productCount: number;
};

export type SupplierDetailExtension = {
  legalAddress?: string | null;
  website?: string | null;
  inn?: string | null;
  innSourcesLine?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  branches?: SupplierBranchSeed[];
  description?: string | null;
};

const DESC_IVANOV_KOMPANIYA = `Описание

КОНСТРУКЦИЯ КАБЕЛЯ ВБШв:

1- Токопроводящая жила – медная, однопроволочная или многопроволочная, круглой или секторной формы, 1 или 2 класса по ГОСТ 22483
2- Изоляция – из поливинилхлоридного пластиката (ПВХ). Скрутка – изолированные жилы двух-, трех-, четырех-и пятижильных кабелей скручены; двухжильные кабели имеют жилы одинакового сечения, трех-, четырех- и пятижильные имеют все жилы одинакового сечения или одну жилу меньшего сечения (жилу заземления или нулевую).`;

const BRANCH_PERM: SupplierBranchSeed = {
  city: 'Пермь',
  address: 'ул. Ольховская, д. 19',
  hoursWeekday: 'Пн-пт: 09:00–21:00',
  hoursWeekend: 'Сб-вс: 10:00–20:00',
  productCount: 10,
};

const BRANCH_MSK: SupplierBranchSeed = {
  city: 'Москва',
  address: 'ул. Электрозаводская, д. 21, стр. 3',
  hoursWeekday: 'Пн–пт: 09:00–18:00',
  hoursWeekend: 'Сб: 10:00–16:00, вс: выходной',
  productCount: 24,
};

const BRANCH_SPB: SupplierBranchSeed = {
  city: 'Санкт-Петербург',
  address: 'пр. Обуховской Обороны, д. 120, лит. А',
  hoursWeekday: 'Пн–пт: 08:30–17:30',
  hoursWeekend: 'Сб–вс: выходной',
  productCount: 18,
};

const BRANCH_KZN: SupplierBranchSeed = {
  city: 'Казань',
  address: 'ул. Восстания, д. 100, оф. 12',
  hoursWeekday: 'Пн–пт: 10:00–19:00',
  hoursWeekend: 'Сб: 11:00–17:00, вс: выходной',
  productCount: 14,
};

const BRANCH_NN: SupplierBranchSeed = {
  city: 'Нижний Новгород',
  address: 'ул. Рождественская, д. 38',
  hoursWeekday: 'Пн–пт: 09:00–18:00',
  hoursWeekend: 'Сб–вс: по договорённости',
  productCount: 9,
};

const BRANCH_EKB: SupplierBranchSeed = {
  city: 'Екатеринбург',
  address: 'ул. Малышева, д. 5',
  hoursWeekday: 'Пн–пт: 09:00–18:00',
  hoursWeekend: 'Сб: 10:00–15:00, вс: выходной',
  productCount: 31,
};

const DESC_SHORT = (tagline: string) =>
  `${tagline}\n\nПоставщик в каталоге «Электротехника»: кабель, провод, низковольтное оборудование. Работаем с юридическими лицами, отгрузка со складов в регионе присутствия.`;

export const SUPPLIER_DETAIL_BY_SLUG: Record<string, SupplierDetailExtension> = {
  'ivanov-partners': {
    legalAddress: '105120, г. Москва, ул. Золоторожский Вал, д. 11',
    website: 'https://ivanov-partners.example',
    inn: '7707123456',
    innSourcesLine: 'Контур.Фокус · Sabby · ФНС · Чекко',
    contactPerson: 'Мария Ивановна Петрова',
    phone: '+7 (495) 123-45-67',
    email: 'sales@ivanov-partners.example',
    branches: [BRANCH_MSK, BRANCH_PERM],
    description: DESC_SHORT('ООО «Иванов и партнеры» — оптовые поставки кабельно-проводниковой продукции.'),
  },
  'ivanov-kompaniya': {
    legalAddress: '614047, г. Пермь, ул. Ольховская, д. 7',
    website: 'https://pbkab.ru',
    inn: '5903123193',
    innSourcesLine: 'ФНС · Контур.Фокус · Saby · Чекко',
    contactPerson: 'Артём Сергеевич Агалаков',
    phone: '+7 (342) 275-57-71',
    email: 'zakaz@s-kabel.ru',
    branches: [BRANCH_PERM, BRANCH_PERM, BRANCH_PERM],
    description: DESC_IVANOV_KOMPANIYA,
  },
  'electro-snab': {
    legalAddress: '192007, г. Санкт-Петербург, Лиговский пр., д. 50',
    website: 'https://electro-snab.example',
    inn: '7801567890',
    innSourcesLine: 'Контур.Фокус · ФНС · Чекко',
    contactPerson: 'Дмитрий Олегович Смирнов',
    phone: '+7 (812) 555-01-02',
    email: 'zakaz@electro-snab.example',
    branches: [BRANCH_SPB],
    description: DESC_SHORT('ООО «ЭлектроСнаб» — комплексные поставки для монтажных и проектных организаций.'),
  },
  'kabel-profi': {
    legalAddress: '115088, г. Москва, 2-й Южнопортовый пр., д. 16',
    website: 'https://kabel-profi.example',
    inn: '7708234567',
    innSourcesLine: 'Контур.Фокус · Sabby · ФНС',
    contactPerson: 'Елена Викторовна Козлова',
    phone: '+7 (495) 987-65-43',
    email: 'opt@kabel-profi.example',
    branches: [BRANCH_MSK, BRANCH_KZN],
    description: DESC_SHORT('ООО «КабельПрофи» — складские позиции силового и монтажного кабеля.'),
  },
  'svet-torg': {
    legalAddress: '603001, г. Нижний Новгород, ул. Большая Печёрская, д. 47',
    website: 'https://svet-torg.example',
    inn: '5260987654',
    innSourcesLine: 'ФНС · Чекко',
    contactPerson: 'Андрей Павлович Лебедев',
    phone: '+7 (831) 234-56-78',
    email: 'info@svet-torg.example',
    branches: [BRANCH_NN],
    description: DESC_SHORT('ООО «СветТорг» — светотехника и комплектующие для объектов любого масштаба.'),
  },
  'elektrokomplekt': {
    legalAddress: '115230, г. Москва, Варшавское ш., д. 1, стр. 6',
    website: 'https://elektrokomplekt.example',
    inn: '7709345678',
    innSourcesLine: 'Контур.Фокус · ФНС · Saby · Чекко',
    contactPerson: 'Ирина Николаевна Волкова',
    phone: '+7 (495) 111-22-33',
    email: 'b2b@elektrokomplekt.example',
    branches: [BRANCH_MSK, BRANCH_EKB],
    description: DESC_SHORT('АО «Электрокомплект» — низковольтное оборудование и автоматика.'),
  },
  'moskabel': {
    legalAddress: '127322, г. Москва, ул. Сущёвский Вал, д. 5',
    website: 'https://moskabel.example',
    inn: '7710456789',
    innSourcesLine: 'Контур.Фокус · ФНС',
    contactPerson: 'Сергей Александрович Орлов',
    phone: '+7 (495) 444-55-66',
    email: 'sales@moskabel.example',
    branches: [BRANCH_MSK],
    description: DESC_SHORT('ООО «Москабель» — кабельная продукция для строительства и промышленности.'),
  },
};
