import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'suppliers' })
export class Supplier extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'varchar' })
  name!: string;

  /** ИНН и контакты — то же, что отдаёт публичный API; редактируется в AdminJS. */
  @Column({ type: 'varchar', length: 32, nullable: true })
  inn!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  website!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email!: string | null;

  @Column({ name: 'legal_address', type: 'text', nullable: true })
  legalAddress!: string | null;

  @Column({ name: 'contact_person', type: 'varchar', length: 200, nullable: true })
  contactPerson!: string | null;

  @Column({ name: 'inn_sources_line', type: 'varchar', length: 512, nullable: true })
  innSourcesLine!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'branches_json', type: 'jsonb', nullable: true })
  branchesJson!: unknown | null;

  @OneToMany(() => Product, (p) => p.supplier)
  products!: Product[];
}
