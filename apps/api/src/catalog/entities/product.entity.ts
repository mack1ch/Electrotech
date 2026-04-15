import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { Manufacturer } from './manufacturer.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
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

  @ManyToOne(() => Manufacturer, (m) => m.products, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer!: Manufacturer | null;

  @Column({ name: 'manufacturer_id', type: 'uuid', nullable: true })
  manufacturerId!: string | null;

  /** Текст для карточки товара (из сидов / AdminJS). */
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  /** Верхняя граница цены в карточке (строка для UI), без связи с `price`. */
  @Column({ name: 'price_max_display', type: 'varchar', length: 64, nullable: true })
  priceMaxDisplay!: string | null;

  @Column({ name: 'specifications_json', type: 'jsonb', nullable: true })
  specificationsJson!: unknown | null;

  @Column({ name: 'offers_json', type: 'jsonb', nullable: true })
  offersJson!: unknown | null;

  @Column({ name: 'supplier_card_json', type: 'jsonb', nullable: true })
  supplierCardJson!: unknown | null;
}
