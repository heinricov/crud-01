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
