import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // always import PrismaModule if using PrismaService
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [PrismaModule],
})
export class ItemsModule {}
