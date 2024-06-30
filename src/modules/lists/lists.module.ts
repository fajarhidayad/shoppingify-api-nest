import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ListsService],
  controllers: [ListsController],
  imports: [PrismaModule],
})
export class ListsModule {}
