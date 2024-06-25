import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Create category service
  // Category name should be unique for one user only
  async create(params: { userId: number; name: string }): Promise<Category> {
    // first find category by userId and category name
    const checkCategory = await this.findUnique(params);

    // check whether the category is already exist or not
    // if exist then throw an error
    if (checkCategory) throw new BadRequestException('Category already exist');

    // create category by userId and category name
    const category = await this.prisma.category.create({
      data: params,
    });

    return category;
  }

  // find all categories by userId and return it as category array
  async findAll(userId: number): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
    });

    return categories;
  }

  // find unique category by userId and category name, return it as an object or null
  async findUnique(params: {
    userId: number;
    name: string;
  }): Promise<Category | null> {
    const { userId, name } = params;
    const category = await this.prisma.category.findUnique({
      where: { name_userId: { name, userId } },
    });
    return category;
  }

  async findById(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    // if it not exist then throw an error
    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  // update the category name
  async update(params: { id: number; name: string }): Promise<Category> {
    // first find the category, is it exist or not
    const category = await this.findById(params.id);

    // update the category name by userId
    return await this.prisma.category.update({
      where: { id: category.id },
      data: { name: params.name },
    });
  }

  // delete category
  async delete(id: number): Promise<Category> {
    const category = await this.findById(id);

    return await this.prisma.category.delete({ where: { id: category.id } });
  }
}
