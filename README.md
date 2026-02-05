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
