import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  process?: { env?: { NODE_ENV?: string } };
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (globalForPrisma.process?.env?.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
