import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit/audit-service";
import { permissionService } from "@/services/permissions/permission-service";
import { partnerInputSchema, partnerQuerySchema, partnerUpdateSchema } from "@/lib/validations/partners";
import type { AuthContext } from "@/types/auth";

export class PartnerService {
  async list(ctx: AuthContext, query: unknown = {}) {
    permissionService.require(ctx, "settings.partner.manage");
    const payload = partnerQuerySchema.parse(query);
    const where = {
      deletedAt: null,
      ...(payload.partner_type ? { partnerType: payload.partner_type } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.keyword ? { name: { contains: payload.keyword } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (payload.page - 1) * payload.limit,
        take: payload.limit,
      }),
      prisma.partner.count({ where }),
    ]);

    return { items, total, page: payload.page, limit: payload.limit };
  }

  async create(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "settings.partner.manage");
    const payload = partnerInputSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.create({
        data: {
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
          notes: payload.notes,
          partnerType: payload.partner_type,
        },
      });
      await new AuditService(tx).write({
        ctx,
        domain: "GLOBAL",
        module: "settings.partner",
        action: "create",
        entityType: "partner",
        entityId: partner.id,
        newValue: partner,
      });
      return partner;
    });
  }

  async update(ctx: AuthContext, partnerId: string, input: unknown) {
    permissionService.require(ctx, "settings.partner.manage");
    const payload = partnerUpdateSchema.parse(input);
    const current = await prisma.partner.findUniqueOrThrow({ where: { id: partnerId } });

    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.update({
        where: { id: partnerId },
        data: {
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
          notes: payload.notes,
          partnerType: payload.partner_type,
          status: payload.status,
        },
      });
      await new AuditService(tx).write({
        ctx,
        domain: "GLOBAL",
        module: "settings.partner",
        action: "update",
        entityType: "partner",
        entityId: partner.id,
        oldValue: current,
        newValue: partner,
      });
      return partner;
    });
  }

  async deactivate(ctx: AuthContext, partnerId: string) {
    permissionService.require(ctx, "settings.partner.manage");
    const current = await prisma.partner.findUniqueOrThrow({ where: { id: partnerId } });

    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.update({ where: { id: partnerId }, data: { status: "INACTIVE" } });
      await new AuditService(tx).write({
        ctx,
        domain: "GLOBAL",
        module: "settings.partner",
        action: "deactivate",
        entityType: "partner",
        entityId: partner.id,
        oldValue: current,
        newValue: partner,
      });
      return partner;
    });
  }

  async search(ctx: AuthContext, q: string, type?: "SUPPLIER" | "CONSIGNMENT" | "BOTH") {
    permissionService.require(ctx, "settings.partner.manage");
    return prisma.partner.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        ...(type ? { partnerType: type } : {}),
        name: { contains: q },
      },
      orderBy: { name: "asc" },
      take: 20,
    });
  }
}

export const partnerService = new PartnerService();
