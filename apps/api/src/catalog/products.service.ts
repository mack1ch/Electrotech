import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { Product } from './entities/product.entity';
import {
  PRODUCT_DETAIL_BY_SLUG,
  type ProductDetailExtension,
  type SupplierPortalBadge,
} from './product-detail.extensions';
import { SUPPLIER_DETAIL_BY_SLUG } from './supplier-detail.extensions';

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

export type ProductDetailItem = ProductListItem & {
  priceMax: string | null;
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
  ) {}

  async list(query: ListProductsQueryDto): Promise<{
    items: ProductListItem[];
    total: number;
  }> {
    const qb = this.products
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.supplier', 's')
      .leftJoinAndSelect('p.category', 'c');

    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      qb.andWhere('(p.name ILIKE :term OR p.sku ILIKE :term)', { term });
    }

    if (query.category?.trim()) {
      qb.andWhere('c.slug = :slug', { slug: query.category.trim() });
    }
    if (query.supplier?.trim()) {
      qb.andWhere('s.slug = :supplierSlug', { supplierSlug: query.supplier.trim() });
    }
    if (query.supplierCity?.trim()) {
      const city = query.supplierCity.trim().toLowerCase();
      const matchingSlugs = Object.entries(SUPPLIER_DETAIL_BY_SLUG)
        .filter(([, ext]) => (ext.branches ?? []).some((b) => b.city.toLowerCase() === city))
        .map(([slug]) => slug);
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
      relations: { supplier: true, category: true },
    });
    if (!p) {
      return null;
    }
    const base = this.toListItem(p);
    const ext = PRODUCT_DETAIL_BY_SLUG[slug] ?? {};
    return this.toDetailItem(base, p, ext);
  }

  private toDetailItem(
    base: ProductListItem,
    p: Product,
    ext: ProductDetailExtension,
  ): ProductDetailItem {
    const specifications = ext.specifications ?? [];
    const manufacturer = ext.manufacturer ?? (p.category ? p.category.name : null);
    const supplierCard: ProductSupplierCard = {
      companyName: ext.supplierCard?.companyName ?? base.supplier.name,
      slug: base.supplier.slug,
      address: ext.supplierCard?.address ?? null,
      website: ext.supplierCard?.website ?? null,
      phone: ext.supplierCard?.phone ?? null,
      inn: ext.supplierCard?.inn ?? null,
      innSourcesLine: ext.supplierCard?.innSourcesLine ?? null,
      onPortalSince: ext.supplierCard?.onPortalSince ?? null,
      onPortalBadge: ext.supplierCard?.onPortalBadge ?? null,
    };
    const offers: ProductOfferRow[] =
      ext.offers?.map((o) => ({
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
      })) ?? [this.buildDefaultOffer(base)];

    return {
      ...base,
      priceMax: ext.priceMax ?? null,
      manufacturer,
      description: ext.description ?? null,
      specifications,
      supplierCard,
      offers,
    };
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
    };
  }
}
