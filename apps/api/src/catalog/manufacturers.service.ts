import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from './entities/manufacturer.entity';

export type ManufacturerListItem = { id: string; slug: string; name: string };

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturers: Repository<Manufacturer>,
  ) {}

  async listAll(): Promise<ManufacturerListItem[]> {
    const rows = await this.manufacturers.find({ order: { name: 'ASC' } });
    return rows.map((m) => ({ id: m.id, slug: m.slug, name: m.name }));
  }
}
