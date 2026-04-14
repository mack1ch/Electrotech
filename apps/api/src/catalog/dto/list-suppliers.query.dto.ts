import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const SUPPLIER_SORT = ['name_asc', 'name_desc'] as const;

export class ListSuppliersQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  /** Slug(и) категорий товаров через запятую: остаются поставщики, у которых есть товары в любой из категорий. */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  /** Город склада (как в сидах веток поставщика); фильтр по расширению SUPPLIER_DETAIL_BY_SLUG. */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  warehouse?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUPPLIER_SORT)
  sort?: (typeof SUPPLIER_SORT)[number];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;
}
