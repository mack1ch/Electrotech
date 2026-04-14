import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListSuppliersQueryDto } from './dto/list-suppliers.query.dto';
import { Supplier } from './entities/supplier.entity';
import {
  SUPPLIER_DETAIL_BY_SLUG,
  type SupplierBranchSeed,
  type SupplierDetailExtension,
} from './supplier-detail.extensions';

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
  const ext = SUPPLIER_DETAIL_BY_SLUG[s.slug] ?? {};
  const cities = [...new Set((ext.branches ?? []).map((b) => b.city))];
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    inn: ext.inn ?? null,
    warehouseCitiesLine: cities.length ? cities.join(', ') : null,
    website: ext.website ?? null,
    phone: ext.phone ?? null,
    emailsLine: ext.email ?? null,
    otherLine: ext.innSourcesLine ?? null,
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
      filtered = rows.filter((s) => {
        const ext = SUPPLIER_DETAIL_BY_SLUG[s.slug] ?? {};
        return (ext.branches ?? []).some((b) => b.city.toLowerCase() === w);
      });
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
    const ext: SupplierDetailExtension = SUPPLIER_DETAIL_BY_SLUG[slug] ?? {};
    return {
      ...listItemFromSupplier(s),
      legalAddress: ext.legalAddress ?? null,
      innSourcesLine: ext.innSourcesLine ?? null,
      contactPerson: ext.contactPerson ?? null,
      email: ext.email ?? null,
      branches: ext.branches ?? [],
      description: ext.description ?? null,
    };
  }
}
