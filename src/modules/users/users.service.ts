import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const checkUser = await this.findByEmail(data.email);

    if (checkUser) throw new BadRequestException('User already exist');

    return await this.prisma.user.create({
      data,
    });
  }
}
