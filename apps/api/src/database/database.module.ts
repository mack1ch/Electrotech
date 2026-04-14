import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../catalog/entities/category.entity';
import { Manufacturer } from '../catalog/entities/manufacturer.entity';
import { Product } from '../catalog/entities/product.entity';
import { Supplier } from '../catalog/entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error('DATABASE_URL is required for API catalog features');
        }
        const sync =
          process.env.TYPEORM_SYNC === 'true' ||
          (process.env.NODE_ENV !== 'production' && process.env.TYPEORM_SYNC !== 'false');
        return {
          type: 'postgres' as const,
          url,
          entities: [Supplier, Category, Manufacturer, Product],
          synchronize: sync,
          logging: process.env.TYPEORM_LOGGING === 'true',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
