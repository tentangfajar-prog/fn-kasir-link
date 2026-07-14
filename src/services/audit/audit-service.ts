import type { Domain, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuthContext } from "@/types/auth";

type AuditDb = PrismaClient | Prisma.TransactionClient;

type AuditInput = {
  ctx?: AuthContext;
  domain: Domain;
  module: string;
  action: string;
  entityType?: string;
  entityId?: string;
  entityNo?: string;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: unknown;
};

export class AuditService {
  constructor(private readonly db: AuditDb = prisma) {}

  async write(input: AuditInput) {
    return this.db.auditLog.create({
      data: {
        domain: input.domain,
        module: input.module,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityNo: input.entityNo,
        actorId: input.ctx?.user.id,
        oldValue: input.oldValue === undefined ? undefined : JSON.parse(JSON.stringify(input.oldValue)),
        newValue: input.newValue === undefined ? undefined : JSON.parse(JSON.stringify(input.newValue)),
        metadata: input.metadata === undefined ? undefined : JSON.parse(JSON.stringify(input.metadata)),
      },
    });
  }
}

export const auditService = new AuditService();
