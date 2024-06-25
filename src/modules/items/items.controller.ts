import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateItemDto, createItemSchema } from './dto/create-item.dto';
import { UpdateItemDto, updateItemSchema } from './dto/update-item.dto';
import { ItemsService } from './items.service';

@UseGuards(JwtAuthGuard)
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
  @UsePipes(new ZodValidationPipe(createItemSchema))
  create(@Body() itemData: CreateItemDto) {
    return this.itemsService.create(itemData);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateItemSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() itemData: UpdateItemDto,
  ) {
    return this.itemsService.update({ id, data: itemData });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.delete(id);
  }
}
