import type { Domain, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { permissionService } from "@/services/permissions/permission-service";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;

type PrintableType = "warung_sale" | "brilink_transaction" | "warung_closing" | "brilink_closing" | "consignment_payment";

export class PrintService {
  async printDocument(ctx: AuthContext, entityType: PrintableType, entityId: string, format = "html") {
    permissionService.require(ctx, "print.reprint");
    const printable = await this.getPrintableData(ctx, entityType, entityId);
    await this.recordPrintLog(prisma, { ctx, domain: printable.domain, module: "print", entityType, entityId, entityNo: printable.entityNo, metadata: { format } });
    return { format, printable };
  }

  async recordPrintLog(db: Tx | typeof prisma, payload: { ctx?: AuthContext; domain: Domain; module: string; entityType: string; entityId: string; entityNo?: string | null; metadata?: unknown }) {
    return db.printLog.create({ data: { domain: payload.domain, module: payload.module, entityType: payload.entityType, entityId: payload.entityId, entityNo: payload.entityNo, actorId: payload.ctx?.user.id, metadata: payload.metadata as Prisma.InputJsonValue } });
  }

  async getPrintableData(ctx: AuthContext, entityType: PrintableType, entityId: string) {
    if (entityType === "warung_sale") {
      permissionService.requireDomain(ctx, "WARUNG");
      const data = await prisma.warungSale.findUniqueOrThrow({ where: { id: entityId }, include: { items: true } });
      return { domain: "WARUNG" as const, entityNo: data.documentNo, data };
    }
    if (entityType === "brilink_transaction") {
      permissionService.requireDomain(ctx, "BRILINK");
      const data = await prisma.brilinkTransaction.findUniqueOrThrow({ where: { id: entityId } });
      return { domain: "BRILINK" as const, entityNo: data.documentNo, data };
    }
    if (entityType === "warung_closing") {
      permissionService.requireDomain(ctx, "WARUNG");
      const data = await prisma.warungClosing.findUniqueOrThrow({ where: { id: entityId } });
      return { domain: "WARUNG" as const, entityNo: data.documentNo, data };
    }
    if (entityType === "brilink_closing") {
      permissionService.requireDomain(ctx, "BRILINK");
      const data = await prisma.brilinkClosing.findUniqueOrThrow({ where: { id: entityId } });
      return { domain: "BRILINK" as const, entityNo: data.documentNo, data };
    }
    const data = await prisma.consignmentPayment.findUniqueOrThrow({ where: { id: entityId }, include: { entry: true } });
    permissionService.requireDomain(ctx, data.entry.domain);
    return { domain: data.entry.domain, entityNo: data.documentNo, data };
  }
}

export const printService = new PrintService();
