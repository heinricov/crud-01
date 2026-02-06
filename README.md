# CRUD Project

## Stack Project

- Frontend: Next.js
- Backend: Nest.js
- ORM: TypeORM
- Database: PostgreSQL

## First Setup

1. Setup Project use shadcn/ui setup project monorepo

```bash
pnpm dlx shadcn@latest init
```

Select the Next.js (Monorepo) option.

```bash
? Would you like to start a new project?
    Next.js
❯   Next.js (Monorepo)
```

after proses setup crash, you in project directory, and run:

```bash
pnpm install
```

To add components to your project, run the add command in the path of your app.

```bash
cd apps/web
```

Add the button component to your project.

```bash
pnpm dlx shadcn@latest add [COMPONENT]
```

2. setup API project use Nest.js in apps/ directory

```bash
nest new api
```

## API : Setup TypeORM

1. Install packages for TypeORM

```bash
pnpm add @nestjs/typeorm typeorm pg reflect-metadata dotenv
pnpm add -D @types/node
pnpm add class-transformer class-validator
```

2. Create TypeORM configuration file

Create a new file `typeormConfig.ts` in the `src/database` directory.

```bash
mkdir src/database
touch src/database/typeormConfig.ts
touch .env
```

3. Add TypeORM configuration to `typeormConfig.ts`

Add the following code to `typeormConfig.ts`:

```typescript
import "dotenv/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "mydatabase",
  entities: [join(__dirname, "..", "**", "*.entity.{ts,js}")],
  migrations: [join(__dirname, "migrations", "*.{ts,js}")],
  synchronize: false
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...dataSourceOptions,
  autoLoadEntities: true,
  synchronize: (process.env.DB_SYNCHRONIZE ?? "false") === "true"
};
```

4. add Environment Variables

Add the following environment variables to your `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=mydatabase
DB_SYNCHRONIZE=false
```

5. update `app.module.ts`

Add the following code to `app.module.ts`:

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./database/typeormConfig";

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [],
  providers: []
})
export class AppModule {}
```

6. update `main.ts`

Add the following code to `main.ts`:

```typescript
import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const port = Number(process.env.PORT ?? 4000);
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`your aplikasi runing in http://localhost:${port}`);
}
void bootstrap();
```

7. Test Run

Run the following command to start the API server:

```bash
pnpm run start:dev
```

You should see the following output:

```bash
your aplikasi runing in http://localhost:4000
```

## API : Create Entity

1. Create a new entity

Create a new file `blog.entity.ts` in the `src/entities` directory.

```bash
mkdir src/entities
touch src/entities/blog.entity.ts
```

Add the following code to `blog.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
```

2. Update `typeormConfig.ts`

Add the following code to `typeormConfig.ts`:

```typescript
import { join } from "path";

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...dataSourceOptions,
  autoLoadEntities: true,
  synchronize: (process.env.DB_SYNCHRONIZE ?? "false") === "true"
};
```

3. Update `app.module.ts`

Add the following code to `app.module.ts`:

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./database/typeormConfig";
import { Blog } from "./entities/blog.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Blog])
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
```

## API : Setup Migration Entity to Database

1. Build project API agar DataSource TS terkompilasi ke JS

```bash
pnpm run build
```

2. Generate Migration dari Entity menggunakan DataSource hasil build

```bash
pnpm run build
pnpm typeorm migration:generate src/database/migrations/CreateBlogTable -d dist/database/typeormConfig.js
```

3. Jalankan Migration ke database

```bash
pnpm run build
pnpm typeorm migration:run -d dist/database/typeormConfig.js
```

4. Revert Migration

```bash
pnpm typeorm migration:revert -d dist/database/typeormConfig.js
```

5. Lihat migrasi yang sudah/akan dijalankan:

```bash
pnpm typeorm migration:show -d dist/database/typeormConfig.js
```

## API : Create Endpoint

1. Create a new resource, in this case, we will create a new resource called `blog`.

```bash
nest g resource blog --no-spec
rm -rf src/blog/entities
```

2. Update `create-blog.dto.ts`

Add the following code to `create-blog.dto.ts`:

```typescript
export class CreateBlogDto {
  title: string;
  content: string;
}
```

3. Update `blog.controller.ts`

Add the following code to `blog.controller.ts`:

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Controller("blogs")
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
                new Date(b.updatedAt ?? b.createdAt).getTime()
              )
            )
          ).toISOString()
        : null;
    return {
      statusCode: 200,
      message: "OK",
      count: items.length,
      updatedAt: lastUpdated,
      date: new Date().toISOString(),
      data: items.map((b) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }))
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const b = await this.blogService.findOne(Number(id));
    return {
      statusCode: 200,
      message: "OK",
      date: new Date().toISOString(),
      data: {
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }
    };
  }

  @Post()
  async create(@Body() dto: CreateBlogDto) {
    const b = await this.blogService.create(dto);
    return {
      statusCode: 201,
      message: "Blog dibuat",
      date: new Date().toISOString(),
      data: {
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }
    };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateBlogDto) {
    const b = await this.blogService.update(Number(id), dto);
    return {
      statusCode: 200,
      message: "Blog diperbarui",
      date: new Date().toISOString(),
      data: {
        id: b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.blogService.remove(Number(id));
    return {
      statusCode: 200,
      message: "Blog dihapus",
      date: new Date().toISOString(),
      data: { id: Number(id) }
    };
  }

  @Delete()
  async removeAll() {
    const affected = await this.blogService.removeAll();
    return {
      statusCode: 200,
      message: "Semua blog dihapus",
      date: new Date().toISOString(),
      count: affected
    };
  }
}
```

4. Update `blog.service.ts`

Add the following code to `blog.service.ts`:

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "../entities/blog.entity";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>
  ) {}

  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException("Blog tidak ditemukan");
    }
    return blog;
  }

  async create(dto: CreateBlogDto): Promise<Blog> {
    const entity = this.blogRepository.create({
      title: dto.title,
      content: dto.content
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
```

5. Update `blog.module.ts`

Add the following code to `blog.module.ts`:

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { Blog } from "../entities/blog.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
```

## API : Setup Swagger

1. Instal paket Swagger untuk Nest.js

```bash
cd apps/api
pnpm add @nestjs/swagger swagger-ui-express
```

2. Aktifkan Swagger di `main.ts`

```typescript
import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const port = Number(process.env.PORT ?? 4000);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("CRUD API")
    .setDescription("Dokumentasi API Blog")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
  console.log(`your aplikasi runing in http://localhost:${port}`);
}
void bootstrap();
```

3. (Opsional) Tambahkan tag pada controller

```typescript
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";

@ApiTags("blogs")
@Controller("blogs")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() {
    return this.blogService.findAll();
  }
}
```

4. Jalankan aplikasi dan akses dokumentasi

```bash
pnpm run start:dev
# Buka http://localhost:4000/docs
```

## API : Setup CORS

1. Aktifkan CORS di `main.ts`

```typescript
import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
  const port = Number(process.env.PORT ?? 4000);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("CRUD API")
    .setDescription("Dokumentasi API Blog")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const corsOptions: CorsOptions = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  app.enableCors(corsOptions);
  console.log(
    "CORS enabled: allow all origins; methods GET,HEAD,PUT,PATCH,POST,DELETE"
  );

  await app.listen(port);
  console.log(`your aplikasi runing in http://localhost:${port}`);
  console.log(`Public API accessible at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
void bootstrap();
```

2. Uji CORS dengan Postman

- Buka Postman
- Buat request baru
- Set method ke `GET`
- Masukkan URL `http://localhost:4000/blogs`
- Klik `Send`
- Periksa apakah request berhasil dan menerima response

## WEB : Setup UI component

masuk ke folder `apps/web`

```bash
cd apps/web
```

1. Install Component Shadcn

```bash
pnpm dlx shadcn@latest add card
```

2. Buat component `components/blog-card.tsx`

```bash
touch components/blog-card.tsx
```

```typescript
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";

interface BlogCardProps {
  title: string;
  content: string;
  date: string;
}

export function BlogCard({ title, content, date }: BlogCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{date}</p>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-sm text-foreground line-clamp-3">{content}</p>
      </CardContent>
    </Card>
  );
}

```

3. Buat component `components/blog-section.tsx`

```bash
touch components/blog-section.tsx
```

```typescript
"use client";

import { BlogCard } from "./blog-card";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Memulai dengan Next.js 16",
    content:
      "Pelajari cara memulai project Next.js 16 dengan fitur-fitur terbaru termasuk Turbopack, React Compiler, dan peningkatan performa yang signifikan.",
    date: "15 Januari 2025"
  },
  {
    id: "2",
    title: "Best Practices Tailwind CSS",
    content:
      "Pahami best practices menggunakan Tailwind CSS untuk membuat design system yang konsisten dan maintainable di project React Anda.",
    date: "10 Januari 2025"
  },
  {
    id: "3",
    title: "Authentication dengan NextAuth",
    content:
      "Panduan lengkap mengimplementasikan authentication yang aman menggunakan NextAuth.js dan database modern seperti Supabase.",
    date: "5 Januari 2025"
  },
  {
    id: "4",
    title: "Server Components vs Client Components",
    content:
      "Pelajari perbedaan antara Server Components dan Client Components di Next.js 16 dan bagaimana memilih yang tepat untuk use case Anda.",
    date: "1 Januari 2025"
  }
];

export function BlogSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Blog
          </h2>
          <p className="text-lg text-muted-foreground">
            Content dibawah di ambil dari API yang sudah di buat di project ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              content={post.content}
              date={post.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

4. Update `page.tsx`

```bash
touch pages/index.tsx
```

```typescript
import { BlogSection } from "@/components/blog-section";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <BlogSection />
    </main>
  );
}

```

5. Test RUN aplikasi

- Buka terminal
- Masuk ke folder `apps/web`
- Jalankan aplikasi dengan perintah `pnpm run dev`
- Buka browser dan akses `http://localhost:3000`
- Periksa apakah halaman blog ditampilkan dengan benar

## WEB : Connect to API

1. Buat file service `services/blog-service.ts`

```bash
touch services/blog-service.ts
```

```typescript
const DEFAULT_BASE_URL = "http://localhost:4000";

type ID = number | string;

export interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseResponse {
  statusCode: number;
  message: string;
  date: string;
}

export interface ListResponse extends BaseResponse {
  count: number;
  updatedAt: string | null;
  data: Blog[];
}

export interface OneResponse extends BaseResponse {
  data: Blog;
}

export interface CreatePayload {
  title: string;
  content: string;
}

export interface UpdatePayload {
  title?: string;
  content?: string;
}

class BlogService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      ...init
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }

  async getAll(): Promise<ListResponse> {
    return this.request<ListResponse>("/blogs");
  }

  async getById(id: ID): Promise<OneResponse> {
    return this.request<OneResponse>(`/blogs/${id}`);
  }

  async create(payload: CreatePayload): Promise<OneResponse> {
    return this.request<OneResponse>("/blogs", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async update(id: ID, payload: UpdatePayload): Promise<OneResponse> {
    return this.request<OneResponse>(`/blogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  }

  async deleteById(id: ID): Promise<BaseResponse & { data: { id: number } }> {
    return this.request<BaseResponse & { data: { id: number } }>(
      `/blogs/${id}`,
      {
        method: "DELETE"
      }
    );
  }

  async deleteAll(): Promise<BaseResponse & { count: number }> {
    return this.request<BaseResponse & { count: number }>("/blogs", {
      method: "DELETE"
    });
  }
}

export const blogService = new BlogService();
export default BlogService;
```

2. Update `components/blog-section.tsx` agar memanggil service `getBlogPosts`

```typescript
"use client";

import { BlogCard } from "./blog-card";
import { useEffect, useState } from "react";
import { blogService, type Blog } from "../services/blog-service";

function formatDate(date: string) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function BlogSection() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    blogService
      .getAll()
      .then((res) => {
        if (!cancelled) {
          setItems(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? "Gagal memuat data");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Blog
          </h2>
          <p className="text-lg text-muted-foreground">
            Content dibawah di ambil dari API yang sudah di buat di project ini.
          </p>
        </div>

        {loading && <p className="text-muted-foreground">Memuat data…</p>}
        {error && (
          <p className="text-destructive">Terjadi kesalahan: {error}</p>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                content={post.content}
                date={formatDate(post.createdAt)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

```

## WEB : Post Setup

1. buat file `components/blog-form.tsx` untuk membuat form post blog

```bash
touch components/blog-form.tsx
```

```typescript
'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface BlogFormProps {
  onSubmit: (data: { title: string; content: string }) => void
  isLoading?: boolean
}

export function BlogForm({ onSubmit, isLoading = false }: BlogFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('Judul dan content tidak boleh kosong')
      return
    }

    onSubmit({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-2xl font-bold text-foreground mb-6">Buat Blog Baru</h3>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Judul
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul blog..."
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
          Konten
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Masukkan konten blog..."
          rows={6}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Menyimpan...' : 'Simpan Blog'}
      </Button>
    </form>
  )
}
```

2. Buat file `components/blog-table.tsx` untuk membuat tabel blog

```bash
touch components/blog-table.tsx
```

```typescript
'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
}

interface BlogTableProps {
  posts: BlogPost[]
}

export function BlogTable({ posts }: BlogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Judul
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Konten
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tanggal
            </th>
          </tr>
        </thead>
        <tbody className="bg-background">
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-border">
              <td className="px-6 py-4 text-sm text-foreground">
                {post.title}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {post.content}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {post.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

3. Buat File `components/post-section.tsx` untuk membuat section post blog

```bash
touch components/post-section.tsx
```

```typescript
"use client";

import { useEffect, useState } from "react";
import { BlogForm } from "./blog-form";
import { BlogTable } from "./blog-table";
import { blogService, type Blog } from "../services/blog-service";
import { Button } from "@workspace/ui/components/button";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface PostSectionProps {
  initialPosts?: BlogPost[];
}

export function PostSection({ initialPosts = [] }: PostSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapToView = (b: Blog): BlogPost => ({
    id: String(b.id),
    title: b.title,
    content: b.content,
    date: new Date(b.createdAt).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  });

  useEffect(() => {
    setIsLoading(true);
    blogService
      .getAll()
      .then((res) => {
        setPosts(res.data.map(mapToView));
      })
      .catch((e) => {
        setError(e.message ?? "Gagal memuat data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddPost = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      const res = await blogService.create({
        title: data.title,
        content: data.content
      });
      setPosts([mapToView(res.data), ...posts]);
      alert("Blog berhasil ditambahkan!");
    } catch (error) {
      alert("Gagal menambahkan blog");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = (id: string) => {
    setIsLoading(true);
    blogService
      .deleteById(Number(id))
      .then(() => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      })
      .catch((e) => {
        alert("Gagal menghapus blog");
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditPost = (post: BlogPost) => {
    const title = prompt("Ubah judul:", post.title) ?? post.title;
    const content = prompt("Ubah konten:", post.content) ?? post.content;
    setIsLoading(true);
    blogService
      .update(Number(post.id), { title, content })
      .then((res) => {
        const updated = mapToView(res.data);
        setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
        alert("Blog berhasil diperbarui!");
      })
      .catch((e) => {
        alert("Gagal memperbarui blog");
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteAll = () => {
    if (!confirm("Anda yakin ingin menghapus semua blog?")) return;
    setIsLoading(true);
    blogService
      .deleteAll()
      .then(() => {
        setPosts([]);
        alert("Semua blog berhasil dihapus!");
      })
      .catch((e) => {
        alert("Gagal menghapus semua blog");
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-12">
          Kelola Blog
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <BlogForm onSubmit={handleAddPost} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {error ? `Error: ${error}` : ""}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={isLoading}
                >
                  Hapus Semua
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    blogService
                      .getAll()
                      .then((res) => setPosts(res.data.map(mapToView)))
                      .finally(() => setIsLoading(false));
                  }}
                  disabled={isLoading}
                >
                  Muat Ulang
                </Button>
              </div>
            </div>
            <BlogTable
              posts={posts}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

```

4. Buat halaman `/posts` untuk menampilkan semua blog post

```bash
mkdir -p app/posts
touch app/posts/page.tsx
```

```typescript
import { PostSection } from '@/components/post-section'

export const metadata = {
  title: 'Kelola Blog | v0 App',
  description: 'Halaman untuk membuat, mengedit, dan menghapus blog posts',
}

export default function PostsPage() {
  const initialPosts = [
    {
      id: '1',
      title: 'Memulai dengan Next.js 16',
      content:
        'Pelajari cara memulai project Next.js 16 dengan fitur-fitur terbaru termasuk Turbopack, React Compiler, dan peningkatan performa yang signifikan.',
      date: '15 Januari 2025',
    },
    {
      id: '2',
      title: 'Best Practices Tailwind CSS',
      content:
        'Pahami best practices menggunakan Tailwind CSS untuk membuat design system yang konsisten dan maintainable di project React Anda.',
      date: '10 Januari 2025',
    },
    {
      id: '3',
      title: 'Authentication dengan NextAuth',
      content:
        'Panduan lengkap mengimplementasikan authentication yang aman menggunakan NextAuth.js dan database modern seperti Supabase.',
      date: '5 Januari 2025',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <PostSection initialPosts={initialPosts} />
    </main>
  )
}
```
