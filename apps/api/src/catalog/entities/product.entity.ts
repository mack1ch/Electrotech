import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  sku!: string | null;

  /** Артикул для отображения в таблице поиска */
  @Column({ type: 'varchar', nullable: true })
  article!: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  price!: string;

  /** В каталоге цена отображается как «По запросу», число в `price` — опорное (сортировка внутри группы). */
  @Column({ name: 'price_on_request', type: 'boolean', default: false })
  priceOnRequest!: boolean;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity!: number;

  @Column({ name: 'last_updated_at', type: 'date', nullable: true })
  lastUpdatedAt!: Date | null;

  @ManyToOne(() => Supplier, (s) => s.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId!: string;

  @ManyToOne(() => Category, (c) => c.products, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId!: string | null;
}
