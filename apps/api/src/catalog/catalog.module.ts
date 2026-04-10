import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';
import { ProductsService } from './products.service';
import { SuppliersService } from './suppliers.service';
import { CatalogSeedService } from './catalog-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Supplier, Category])],
  controllers: [CatalogController],
  providers: [ProductsService, SuppliersService, CategoriesService, CatalogSeedService],
})
export class CatalogModule {}
