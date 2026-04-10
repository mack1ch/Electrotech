import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

export type CategoryDto = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
};

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async listAll(): Promise<CategoryDto[]> {
    const rows = await this.categories.find({ order: { name: 'ASC' } });
    return rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      parentId: c.parentId,
    }));
  }
}
