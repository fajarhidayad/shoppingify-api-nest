import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ListsService } from './lists.service';
import { User } from 'src/common/decorators/user.decorator';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';
import { CreateListDto, createListSchema } from './dto/create-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Get()
  async getAll(@User('id') userId: number) {
    return await this.listsService.getAll(userId);
  }

  @Get('active')
  async getActiveList(@User('id') userId: number) {
    return await this.listsService.getActiveList(userId);
  }

  @Get(':id')
  async getListDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.listsService.getListDetails(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createListSchema))
  async create(@User('id') userId: number, @Body() data: CreateListDto) {
    return await this.listsService.create({ userId, listName: data.name });
  }
}
