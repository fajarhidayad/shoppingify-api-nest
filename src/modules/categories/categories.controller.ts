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
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  createCategorySchema,
} from './dto/create-category.dto';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async create(@Body() data: CreateCategoryDto, @User('id') userId: number) {
    return await this.categoryService.create({ name: data.name, userId });
  }

  @Get()
  async findAll(@User('id') userId: number) {
    return await this.categoryService.findAll(userId);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(z.object({ name: z.string() })))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name }: { name: string },
  ) {
    return await this.categoryService.update({ id, name });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(id);
  }
}
