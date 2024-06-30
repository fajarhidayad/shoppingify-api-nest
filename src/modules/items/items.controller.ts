import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateItemDto, createItemSchema } from './dto/create-item.dto';
import { UpdateItemDto, updateItemSchema } from './dto/update-item.dto';
import { ItemsService } from './items.service';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  findAll(@User('id') userId: number, @Query('item') itemName: string) {
    if (itemName) {
      return this.itemsService.findByQuery(userId, itemName);
    }
    return this.itemsService.findAll(userId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findById(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createItemSchema))
  create(@Body() itemData: CreateItemDto, @User('id') userId: number) {
    return this.itemsService.create({ ...itemData, userId });
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
