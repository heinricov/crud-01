import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog tidak ditemukan');
    }
    return blog;
  }

  async create(dto: CreateBlogDto): Promise<Blog> {
    const entity = this.blogRepository.create({
      title: dto.title,
      content: dto.content,
    });
    return this.blogRepository.save(entity);
  }

  async update(id: number, dto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    blog.title = dto.title ?? blog.title;
    blog.content = dto.content ?? blog.content;
    return this.blogRepository.save(blog);
  }

  async remove(id: number): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
  }

  async removeAll(): Promise<number> {
    const res = await this.blogRepository
      .createQueryBuilder()
      .delete()
      .from(Blog)
      .execute();
    return res.affected ?? 0;
  }
}
