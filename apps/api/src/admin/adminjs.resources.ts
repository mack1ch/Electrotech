import { Category } from '../catalog/entities/category.entity';
import { Manufacturer } from '../catalog/entities/manufacturer.entity';
import { Product } from '../catalog/entities/product.entity';
import { Supplier } from '../catalog/entities/supplier.entity';

const parentCatalog = { name: 'Каталог' as const };

/** Ресурсы AdminJS: русские названия в меню, группа «Каталог», удобные списки колонок. */
export const adminJsResources = [
  {
    resource: Supplier,
    options: {
      parent: parentCatalog,
      navigation: { name: 'Поставщики', icon: 'Users' },
      listProperties: ['name', 'slug', 'inn', 'phone', 'email', 'website', 'contactPerson'],
      sort: { sortBy: 'name', direction: 'asc' },
      properties: {
        slug: { description: 'Уникальный код в URL и API' },
        name: { description: 'Отображаемое название компании' },
        inn: { description: 'ИНН' },
        website: { description: 'Сайт' },
        phone: { description: 'Телефон' },
        email: { description: 'E-mail' },
        legalAddress: { description: 'Юридический адрес' },
        contactPerson: { description: 'Контактное лицо' },
        innSourcesLine: { description: 'Строка источников проверки ИНН' },
        description: { description: 'Текст описания для карточки поставщика' },
        branchesJson: {
          description: 'JSON: массив филиалов { city, address, hoursWeekday, hoursWeekend, productCount }',
        },
      },
    },
  },
  {
    resource: Category,
    options: {
      parent: parentCatalog,
      navigation: { name: 'Категории', icon: 'Layers' },
      listProperties: ['name', 'slug', 'parentId'],
      sort: { sortBy: 'name', direction: 'asc' },
      properties: {
        slug: { description: 'Код категории (cable, equipment, …)' },
        parentId: { description: 'Родитель (null — корень)' },
      },
    },
  },
  {
    resource: Manufacturer,
    options: {
      parent: parentCatalog,
      navigation: { name: 'Производители', icon: 'Tag' },
      listProperties: ['name', 'slug'],
      sort: { sortBy: 'name', direction: 'asc' },
      properties: {
        slug: { description: 'Код производителя для фильтров поиска' },
      },
    },
  },
  {
    resource: Product,
    options: {
      parent: parentCatalog,
      navigation: { name: 'Товары', icon: 'Package' },
      listProperties: [
        'name',
        'slug',
        'sku',
        'article',
        'price',
        'priceOnRequest',
        'stockQuantity',
        'supplier',
        'category',
        'manufacturer',
        'lastUpdatedAt',
      ],
      sort: { sortBy: 'name', direction: 'asc' },
      properties: {
        slug: { description: 'Уникальный код товара в каталоге' },
        priceOnRequest: { description: 'Если да — в витрине цена «По запросу»' },
        stockQuantity: { description: 'Количество на складе (демо)' },
        lastUpdatedAt: { description: 'Дата последнего обновления позиции' },
        description: { description: 'Текст описания в карточке товара' },
        priceMaxDisplay: { description: 'Верхняя граница цены в карточке (строка для UI)' },
        specificationsJson: { description: 'JSON: массив { label, value } для таблицы характеристик' },
        offersJson: { description: 'JSON: массив предложений (поставщик, цена, склады, …)' },
        supplierCardJson: { description: 'JSON: блок «поставщик» на карточке товара (частичное слияние с данными из БД)' },
      },
    },
  },
];
