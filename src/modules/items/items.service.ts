import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const items = await this.prisma.category.findMany({
      where: { userId },
      include: {
        items: true,
      },
    });

    return items;
  }

  async findByQuery(userId: number, itemName: string) {
    const items = await this.prisma.item.findMany({
      where: { AND: [{ userId }, { name: { contains: itemName } }] },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return items;
  }

  async findById(id: number): Promise<Item> {
    const item = await this.prisma.item.findUnique({ where: { id } });

    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  async create(data: CreateItemDto & { userId: number }): Promise<Item> {
    const category = await this.prisma.category.findFirst({
      where: { AND: [{ name: data.categoryName }, { userId: data.userId }] },
    });
    if (category) {
      const newItem = await this.prisma.item.create({
        data: {
          categoryId: category.id,
          name: data.name,
          userId: data.userId,
          imageUrl: data.imageUrl,
          note: data.note,
        },
      });

      return newItem;
    }

    const newCategory = await this.prisma.category.create({
      data: { name: data.categoryName, userId: data.userId },
    });

    const newItem = await this.prisma.item.create({
      data: { ...data, categoryId: newCategory.id },
    });

    return newItem;
  }

  async update(params: { id: number; data: UpdateItemDto }): Promise<Item> {
    const { id, data } = params;
    const item = await this.findById(id);

    const updatedItem = await this.prisma.item.update({
      where: { id: item.id },
      data: {
        ...data,
      },
    });

    return updatedItem;
  }

  async delete(id: number): Promise<Item> {
    return await this.prisma.item.delete({ where: { id } });
  }
}
