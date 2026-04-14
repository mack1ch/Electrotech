import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

function toOptBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0) {
    return false;
  }
  const s = String(value).toLowerCase();
  if (s === '1' || s === 'true' || s === 'yes') {
    return true;
  }
  if (s === '0' || s === 'false' || s === 'no') {
    return false;
  }
  return undefined;
}

function toOptNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function toOptInt(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  const n = Number.parseInt(String(value), 10);
  return Number.isNaN(n) ? undefined : n;
}

export class ListProductsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  /** Category slug filter */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  /** Manufacturer slug filter */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  manufacturer?: string;

  /** Supplier slug filter */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  supplier?: string;

  /** Supplier branch city filter */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  supplierCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(48)
  sort?: string;

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

  @IsOptional()
  @Transform(({ value }) => toOptNumber(value))
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Transform(({ value }) => toOptNumber(value))
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @Transform(({ value }) => toOptInt(value))
  @IsInt()
  @Min(0)
  minStock?: number;

  /** YYYY-MM-DD — товары с lastUpdatedAt >= даты */
  @IsOptional()
  @IsString()
  @MaxLength(32)
  updatedFrom?: string;

  @IsOptional()
  @IsIn(['in_stock', 'on_order', 'expected'])
  availability?: string;

  /** Исключить позиции с ценой «По запросу». */
  @IsOptional()
  @Transform(({ value }) => toOptBoolean(value))
  @IsBoolean()
  excludeOnRequest?: boolean;
}
