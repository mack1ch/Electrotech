import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListSuppliersQueryDto } from './dto/list-suppliers.query.dto';
import { Supplier } from './entities/supplier.entity';
import { supplierBranchesFromDb } from './supplier-branches.util';
import type { SupplierBranchSeed } from './supplier-detail.extensions';

export type SupplierListItem = {
  id: string;
  slug: string;
  name: string;
  inn: string | null;
  warehouseCitiesLine: string | null;
  website: string | null;
  phone: string | null;
  emailsLine: string | null;
  otherLine: string | null;
};

export type SupplierBranchItem = SupplierBranchSeed;

export type SupplierDetailItem = SupplierListItem & {
  legalAddress: string | null;
  innSourcesLine: string | null;
  contactPerson: string | null;
  email: string | null;
  branches: SupplierBranchItem[];
  description: string | null;
};

function listItemFromSupplier(s: Supplier): SupplierListItem {
  const branches = supplierBranchesFromDb(s);
  const cities = [...new Set(branches.map((b) => b.city))];
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    inn: s.inn,
    warehouseCitiesLine: cities.length ? cities.join(', ') : null,
    website: s.website,
    phone: s.phone,
    emailsLine: s.email,
    otherLine: s.innSourcesLine,
  };
}

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliers: Repository<Supplier>,
  ) {}

  async list(query: ListSuppliersQueryDto): Promise<{
    items: SupplierListItem[];
    total: number;
  }> {
    const qb = this.suppliers.createQueryBuilder('s');

    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      qb.andWhere('(s.name ILIKE :term OR s.slug ILIKE :term)', { term });
    }

    if (query.category?.trim()) {
      const categorySlugs = query.category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (categorySlugs.length > 0) {
        qb.innerJoin('s.products', 'p')
          .innerJoin('p.category', 'c')
          .andWhere('c.slug IN (:...catSlugs)', { catSlugs: categorySlugs });
      }
    }

    const sortDir = query.sort === 'name_desc' ? 'DESC' : 'ASC';
    qb.orderBy('s.name', sortDir).distinct(true);

    const rows = await qb.getMany();

    const warehouse = query.warehouse?.trim();
    let filtered = rows;
    if (warehouse) {
      const w = warehouse.toLowerCase();
      filtered = rows.filter((s) =>
        supplierBranchesFromDb(s).some((b) => b.city.toLowerCase() === w),
      );
    }

    const total = filtered.length;
    const slice = filtered.slice(query.offset, query.offset + query.limit);

    return {
      total,
      items: slice.map((s) => listItemFromSupplier(s)),
    };
  }

  async findBySlug(slug: string): Promise<Supplier | null> {
    return this.suppliers.findOne({ where: { slug } });
  }

  async findDetailBySlug(slug: string): Promise<SupplierDetailItem | null> {
    const s = await this.findBySlug(slug);
    if (!s) {
      return null;
    }
    return {
      ...listItemFromSupplier(s),
      legalAddress: s.legalAddress,
      innSourcesLine: s.innSourcesLine,
      contactPerson: s.contactPerson,
      email: s.email,
      branches: supplierBranchesFromDb(s),
      description: s.description,
    };
  }

  /** Уникальные города филиалов из БД — для фильтров витрины. */
  async listWarehouseCities(): Promise<string[]> {
    const rows = await this.suppliers.find();
    const set = new Set<string>();
    for (const s of rows) {
      for (const b of supplierBranchesFromDb(s)) {
        set.add(b.city);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
  }
}
