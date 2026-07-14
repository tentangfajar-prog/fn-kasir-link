# Prisma Setup Guide

Status: **DRAFT BASELINE**  
Domain: GLOBAL

## Purpose

Panduan setup Prisma untuk FN Kasir Link.

## Install

```bash
npm install prisma @prisma/client
```

or with pnpm:

```bash
pnpm add prisma @prisma/client
```

## Init

```bash
npx prisma init
```

## Environment

`.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fn_kasir_link?schema=public"
```

## Generate Client

```bash
npx prisma generate
```

## Development Migration

```bash
npx prisma migrate dev
```

## Production Migration

```bash
npx prisma migrate deploy
```

## Studio

```bash
npx prisma studio
```

## Rules

- Do not edit production database manually.
- Do not use migrate reset in production.
- Do not use db push in production.
- Always backup before production deploy.
- All money/stok workflows must be tested after migration.
