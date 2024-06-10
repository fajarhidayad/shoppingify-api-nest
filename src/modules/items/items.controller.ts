import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Prisma } from '@prisma/client';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  findAll(@Body() { userId }: { userId: number }) {
    return this.itemsService.findAll(userId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findById(id);
  }

  @Post()
  create(@Body() itemData: Prisma.ItemCreateInput) {
    return this.itemsService.create(itemData);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() itemData: Prisma.ItemUpdateInput,
  ) {
    return this.itemsService.update({ id, data: itemData });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.delete(id);
  }
}
