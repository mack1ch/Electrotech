import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_SUPPLIERS } from './catalog-seed.data';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class CatalogSeedService implements OnModuleInit {
  private readonly logger = new Logger(CatalogSeedService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly suppliers: Repository<Supplier>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async onModuleInit(): Promise<void> {
    const force =
      process.env['CATALOG_FORCE_SEED'] === 'true' || process.env['CATALOG_FORCE_SEED'] === '1';
    const demoReseed =
      process.env['CATALOG_DEMO_RESEED'] === 'true' || process.env['CATALOG_DEMO_RESEED'] === '1';
    const isProd = process.env['NODE_ENV'] === 'production';

    if (force && isProd) {
      this.logger.warn('CATALOG_FORCE_SEED ignored in production (use CATALOG_DEMO_RESEED for demo reset)');
    }

    if (demoReseed && isProd) {
      this.logger.warn(
        'CATALOG_DEMO_RESEED: clearing catalog tables and re-seeding (только для демо-VPS)',
      );
      await this.clearCatalogTables();
    } else if (force && !isProd) {
      this.logger.warn('CATALOG_FORCE_SEED: clearing catalog tables and re-seeding');
      await this.clearCatalogTables();
    } else {
      const count = await this.products.count();
      if (count > 0) {
        return;
      }
    }

    this.logger.log('Seeding catalog demo data');

    const supplierEntities = await this.suppliers.save(
      SEED_SUPPLIERS.map((s) => this.suppliers.create(s)),
    );
    const supplierBySlug = new Map(supplierEntities.map((s) => [s.slug, s]));

    const categoryEntities = await this.categories.save(
      SEED_CATEGORIES.map((c) => this.categories.create(c)),
    );
    const categoryBySlug = new Map(categoryEntities.map((c) => [c.slug, c]));

    const rows = SEED_PRODUCTS.map((row) => {
      const supplier = supplierBySlug.get(row.supplierSlug);
      const category = categoryBySlug.get(row.categorySlug);
      if (!supplier || !category) {
        throw new Error(`Seed referential error: ${row.slug}`);
      }
      return this.products.create({
        slug: row.slug,
        name: row.name,
        sku: row.sku,
        article: row.article,
        price: row.price,
        priceOnRequest: row.priceOnRequest === true,
        stockQuantity: row.stockQuantity,
        lastUpdatedAt: new Date(row.lastUpdatedAt),
        supplierId: supplier.id,
        categoryId: category.id,
      });
    });

    await this.products.save(rows);

    this.logger.log(`Catalog seed complete (${rows.length} products)`);
  }

  private async clearCatalogTables(): Promise<void> {
    await this.products.createQueryBuilder().delete().execute();
    await this.suppliers.createQueryBuilder().delete().execute();
    await this.categories.createQueryBuilder().delete().execute();
  }
}
