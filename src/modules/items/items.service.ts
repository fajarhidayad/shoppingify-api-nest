import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item, Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<Item[]> {
    const items = await this.prisma.item.findMany({ where: { userId } });

    return items;
  }

  async findById(id: number): Promise<Item> {
    const item = await this.prisma.item.findUnique({ where: { id } });

    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  async create(data: Prisma.ItemCreateInput): Promise<Item> {
    const newItem = await this.prisma.item.create({ data: { ...data } });

    return newItem;
  }

  async update(params: {
    id: number;
    data: Prisma.ItemUpdateInput;
  }): Promise<Item> {
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
