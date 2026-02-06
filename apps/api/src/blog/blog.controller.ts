import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll() {
    const items = await this.blogService.findAll();
    const lastUpdated =
      items.length > 0
        ? new Date(
            Math.max(
              ...items.map((b) =>
                new Date(b.updatedAt ?? b.createdAt).getTime(),
              ),
            ),
          ).toISOString()
        : null;
    return {
      statusCode: 200,
      message: 'OK',
      count: items.length,
      updatedAt: lastUpdated,
      date: new Date().toISOString(),
      data: items.map((b) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const b = await this.blogService.findOne(id);
    return {
      statusCode: 200,
      message: 'OK',
      date: new Date().toISOString(),
      data: {
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      },
    };
  }

  @Post()
  async create(@Body() dto: CreateBlogDto) {
    const b = await this.blogService.create(dto);
    return {
      statusCode: 201,
      message: 'Blog dibuat',
      date: new Date().toISOString(),
      data: {
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
  ) {
    const b = await this.blogService.update(id, dto);
    return {
      statusCode: 200,
      message: 'Blog diperbarui',
      date: new Date().toISOString(),
      data: {
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.blogService.remove(id);
    return {
      statusCode: 200,
      message: 'Blog dihapus',
      date: new Date().toISOString(),
      data: { id },
    };
  }

  @Delete()
  async removeAll() {
    const affected = await this.blogService.removeAll();
    return {
      statusCode: 200,
      message: 'Semua blog dihapus',
      date: new Date().toISOString(),
      count: affected,
    };
  }
}
