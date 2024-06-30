import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveList(userId: number) {
    const activeList = await this.prisma.list.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        itemListDetails: {
          include: {
            item: true,
          },
        },
      },
    });

    return activeList;
  }

  async getAll(userId: number) {
    const lists = await this.prisma.list.findMany({ where: { userId } });

    return lists;
  }

  async getListDetails(id: number) {
    const list = await this.prisma.list.findUnique({ where: { id } });

    if (!list) throw new NotFoundException('List not found');

    return list;
  }

  async create(data: { userId: number; listName: string }) {
    const checkActiveList = await this.prisma.list.findFirst({
      where: { AND: [{ status: 'ACTIVE' }, { userId: data.userId }] },
    });

    if (checkActiveList)
      throw new BadRequestException(
        "There's currently an active list, only one active list at a time",
      );

    const newList = await this.prisma.list.create({
      data: { name: data.listName, status: 'ACTIVE', userId: data.userId },
    });

    return newList;
  }
}
