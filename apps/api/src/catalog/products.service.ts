import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';
import type {
  ProductDetailOfferSeed,
  ProductDetailSpec,
  ProductDetailSupplierCardSeed,
  SupplierPortalBadge,
} from './product-detail.extensions';
import { supplierBranchesFromDb } from './supplier-branches.util';

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  article: string | null;
  price: string;
  stockQuantity: number;
  lastUpdatedAt: string | null;
  supplier: { id: string; slug: string; name: string };
  category: { id: string; slug: string; name: string } | null;
  manufacturer: { id: string; slug: string; name: string } | null;
};

export type ProductOfferRow = {
  supplierName: string;
  supplierSlug: string;
  price: string;
  warehouseLines: string[];
  stockQuantity: number;
  minOrderQuantity: number | null;
  lastUpdatedAt: string | null;
  phone: string | null;
  email: string | null;
  availabilityLine?: string | null;
};

export type ProductSupplierCard = {
  companyName: string;
  slug: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  inn: string | null;
  innSourcesLine: string | null;
  onPortalSince: string | null;
  onPortalBadge: SupplierPortalBadge | null;
};

export type ProductDetailItem = Omit<ProductListItem, 'manufacturer'> & {
  priceMax: string | null;
  /** Подпись производителя для карточки товара (строка). */
  manufacturer: string | null;
  description: string | null;
  specifications: { label: string; value: string }[];
  supplierCard: ProductSupplierCard;
  offers: ProductOfferRow[];
};

const SORT_KEYS = new Set([
  'price_asc',
  'price_desc',
  'stock_asc',
  'stock_desc',
  'updated_asc',
  'updated_desc',
]);

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(Supplier)
    private readonly suppliers: Repository<Supplier>,
  ) {}

  async list(query: ListProductsQueryDto): Promise<{
    items: ProductListItem[];
    total: number;
  }> {
    const qb = this.products
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.supplier', 's')
      .leftJoinAndSelect('p.category', 'c')
      .leftJoinAndSelect('p.manufacturer', 'm');

    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      qb.andWhere('(p.name ILIKE :term OR p.sku ILIKE :term)', { term });
    }

    if (query.category?.trim()) {
      qb.andWhere('c.slug = :slug', { slug: query.category.trim() });
    }
    if (query.manufacturer?.trim()) {
      qb.andWhere('m.slug = :manufacturerSlug', { manufacturerSlug: query.manufacturer.trim() });
    }
    if (query.supplier?.trim()) {
      qb.andWhere('s.slug = :supplierSlug', { supplierSlug: query.supplier.trim() });
    }
    if (query.supplierCity?.trim()) {
      const city = query.supplierCity.trim().toLowerCase();
      const allSuppliers = await this.suppliers.find();
      const matchingSlugs = allSuppliers
        .filter((sup) => supplierBranchesFromDb(sup).some((b) => b.city.toLowerCase() === city))
        .map((sup) => sup.slug);
      if (matchingSlugs.length === 0) {
        return { items: [], total: 0 };
      }
      qb.andWhere('s.slug IN (:...supplierCitySlugs)', { supplierCitySlugs: matchingSlugs });
    }

    if (query.excludeOnRequest === true) {
      qb.andWhere('p.priceOnRequest = :notOnRequest', { notOnRequest: false });
    }

    if (query.priceMin != null && !Number.isNaN(query.priceMin)) {
      qb.andWhere('p.priceOnRequest = :porMin', { porMin: false }).andWhere(
        'CAST(p.price AS DECIMAL) >= :priceMin',
        { priceMin: query.priceMin },
      );
    }
    if (query.priceMax != null && !Number.isNaN(query.priceMax)) {
      qb.andWhere('p.priceOnRequest = :porMax', { porMax: false }).andWhere(
        'CAST(p.price AS DECIMAL) <= :priceMax',
        { priceMax: query.priceMax },
      );
    }

    if (query.minStock != null && !Number.isNaN(query.minStock)) {
      qb.andWhere('p.stockQuantity >= :minStock', { minStock: query.minStock });
    }

    if (query.updatedFrom?.trim()) {
      qb.andWhere('p.lastUpdatedAt >= CAST(:updatedFrom AS DATE)', {
        updatedFrom: query.updatedFrom.trim(),
      });
    }

    if (query.availability === 'in_stock') {
      qb.andWhere('p.stockQuantity > 0');
    } else if (query.availability === 'on_order') {
      qb.andWhere('p.stockQuantity = 0');
    }

    const total = await qb.clone().getCount();

    const sortKey =
      query.sort && SORT_KEYS.has(query.sort) ? query.sort : 'price_asc';

    // TypeORM в orderBy не принимает CAST(...): парсер принимает «CAST(p» за alias. Сортируем по addSelect-алиасу.
    if (sortKey === 'price_asc' || sortKey === 'price_desc') {
      qb.addSelect('CAST(p.price AS DECIMAL(14,2))', 'price_sort');
    }

    switch (sortKey) {
      case 'price_desc':
        qb.orderBy('p.priceOnRequest', 'ASC')
          .addOrderBy('price_sort', 'DESC')
          .addOrderBy('p.name', 'ASC');
        break;
      case 'stock_asc':
        qb.orderBy('p.stockQuantity', 'ASC').addOrderBy('p.name', 'ASC');
        break;
      case 'stock_desc':
        qb.orderBy('p.stockQuantity', 'DESC').addOrderBy('p.name', 'ASC');
        break;
      case 'updated_asc':
        qb.orderBy('p.lastUpdatedAt', 'ASC', 'NULLS LAST').addOrderBy('p.name', 'ASC');
        break;
      case 'updated_desc':
        qb.orderBy('p.lastUpdatedAt', 'DESC', 'NULLS LAST').addOrderBy('p.name', 'ASC');
        break;
      default:
        qb.orderBy('p.priceOnRequest', 'ASC')
          .addOrderBy('price_sort', 'ASC')
          .addOrderBy('p.name', 'ASC');
    }

    qb.take(query.limit).skip(query.offset);

    const rows = await qb.getMany();

    return {
      total,
      items: rows.map((p) => this.toListItem(p)),
    };
  }

  /**
   * Верхняя граница фильтра по цене: максимум числовой цены среди товаров с явной ценой
   * (как в фильтрации списка — без позиций «по запросу»). Если таких нет — по всем строкам.
   */
  async getPriceFilterMeta(): Promise<{ priceMax: number }> {
    const fallback = 99000;
    const listed = await this.products
      .createQueryBuilder('p')
      .select('MAX(CAST(p.price AS DECIMAL(14,2)))', 'max')
      .where('p.priceOnRequest = :listed', { listed: false })
      .getRawOne<{ max: string | null }>();
    let n = listed?.max != null ? Number.parseFloat(String(listed.max)) : Number.NaN;
    if (!Number.isFinite(n) || n <= 0) {
      const any = await this.products
        .createQueryBuilder('p')
        .select('MAX(CAST(p.price AS DECIMAL(14,2)))', 'max')
        .getRawOne<{ max: string | null }>();
      n = any?.max != null ? Number.parseFloat(String(any.max)) : Number.NaN;
    }
    if (!Number.isFinite(n) || n <= 0) {
      return { priceMax: fallback };
    }
    return { priceMax: Math.max(1, Math.ceil(n)) };
  }

  async findBySlug(slug: string): Promise<ProductDetailItem | null> {
    const p = await this.products.findOne({
      where: { slug },
      relations: { supplier: true, category: true, manufacturer: true },
    });
    if (!p) {
      return null;
    }
    const base = this.toListItem(p);
    return this.toDetailItem(base, p);
  }

  private toDetailItem(base: ProductListItem, p: Product): ProductDetailItem {
    const specifications = this.parseSpecifications(p);
    const cardSeed = this.parseSupplierCardSeed(p);
    const supplierCard: ProductSupplierCard = {
      companyName: cardSeed.companyName ?? base.supplier.name,
      slug: base.supplier.slug,
      address: cardSeed.address ?? null,
      website: cardSeed.website ?? null,
      phone: cardSeed.phone ?? null,
      inn: cardSeed.inn ?? null,
      innSourcesLine: cardSeed.innSourcesLine ?? null,
      onPortalSince: cardSeed.onPortalSince ?? null,
      onPortalBadge: cardSeed.onPortalBadge ?? null,
    };
    const offers = this.parseOffers(p, base);

    return {
      ...base,
      priceMax: p.priceMaxDisplay,
      manufacturer: p.manufacturer ? p.manufacturer.name : null,
      description: p.description,
      specifications,
      supplierCard,
      offers,
    };
  }

  private parseSpecifications(p: Product): ProductDetailSpec[] {
    const raw = p.specificationsJson;
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw as ProductDetailSpec[];
  }

  private parseSupplierCardSeed(p: Product): Partial<ProductDetailSupplierCardSeed> {
    const raw = p.supplierCardJson;
    if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    return raw as Partial<ProductDetailSupplierCardSeed>;
  }

  private parseOffers(p: Product, base: ProductListItem): ProductOfferRow[] {
    const raw = p.offersJson;
    if (!Array.isArray(raw) || raw.length === 0) {
      return [this.buildDefaultOffer(base)];
    }
    return (raw as ProductDetailOfferSeed[]).map((o) => ({
      supplierName: o.supplierName,
      supplierSlug: o.supplierSlug,
      price: o.price,
      warehouseLines: o.warehouseLines,
      stockQuantity: o.stockQuantity,
      minOrderQuantity: o.minOrderQuantity,
      lastUpdatedAt: o.lastUpdatedAt,
      phone: o.phone,
      email: o.email,
      availabilityLine: o.availabilityLine ?? null,
    }));
  }

  private buildDefaultOffer(base: ProductListItem): ProductOfferRow {
    return {
      supplierName: base.supplier.name,
      supplierSlug: base.supplier.slug,
      price: base.price,
      warehouseLines: ['г. Москва, склад'],
      stockQuantity: base.stockQuantity,
      minOrderQuantity: 100,
      lastUpdatedAt: base.lastUpdatedAt,
      phone: null,
      email: null,
    };
  }

  private toListItem(p: Product): ProductListItem {
    const last =
      p.lastUpdatedAt instanceof Date
        ? p.lastUpdatedAt.toISOString().slice(0, 10)
        : p.lastUpdatedAt
          ? String(p.lastUpdatedAt).slice(0, 10)
          : null;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku,
      article: p.article,
      price: p.priceOnRequest ? 'По запросу' : p.price,
      stockQuantity: p.stockQuantity ?? 0,
      lastUpdatedAt: last,
      supplier: {
        id: p.supplier.id,
        slug: p.supplier.slug,
        name: p.supplier.name,
      },
      category: p.category
        ? { id: p.category.id, slug: p.category.slug, name: p.category.name }
        : null,
      manufacturer: p.manufacturer
        ? { id: p.manufacturer.id, slug: p.manufacturer.slug, name: p.manufacturer.name }
        : null,
    };
  }
}
