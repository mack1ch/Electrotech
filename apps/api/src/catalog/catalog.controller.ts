import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ListSuppliersQueryDto } from './dto/list-suppliers.query.dto';
import { CategoriesService } from './categories.service';
import { ManufacturersService } from './manufacturers.service';
import { ProductsService } from './products.service';
import { SuppliersService } from './suppliers.service';

@Controller()
export class CatalogController {
  constructor(
    private readonly products: ProductsService,
    private readonly suppliers: SuppliersService,
    private readonly categories: CategoriesService,
    private readonly manufacturers: ManufacturersService,
  ) {}

  @Get('products')
  listProducts(@Query() query: ListProductsQueryDto) {
    return this.products.list(query);
  }

  @Get('product-price-filter-meta')
  getProductPriceFilterMeta() {
    return this.products.getPriceFilterMeta();
  }

  @Get('products/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    const item = await this.products.findBySlug(slug);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  @Get('categories')
  listCategories() {
    return this.categories.listAll();
  }

  @Get('manufacturers')
  listManufacturers() {
    return this.manufacturers.listAll();
  }

  @Get('suppliers')
  listSuppliers(@Query() query: ListSuppliersQueryDto) {
    return this.suppliers.list(query);
  }

  @Get('suppliers/:slug')
  async getSupplierBySlug(@Param('slug') slug: string) {
    const item = await this.suppliers.findDetailBySlug(slug);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }
}
