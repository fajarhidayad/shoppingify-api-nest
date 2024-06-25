import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

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

  async create(data: CreateItemDto): Promise<Item> {
    const newItem = await this.prisma.item.create({ data });

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
