import type { SettingScope } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit/audit-service";
import { permissionService } from "@/services/permissions/permission-service";
import { settingScopeSchema, updateSettingsSchema } from "@/lib/validations/settings";
import type { AuthContext } from "@/types/auth";

const domainScopedPermissions: Partial<Record<SettingScope, string>> = {
  WARUNG: "warung.access",
  BRILINK: "brilink.access",
};

export class SettingsService {
  async get(ctx: AuthContext, scope: unknown) {
    const parsedScope = settingScopeSchema.parse(scope);
    this.requireManage(ctx, parsedScope);

    return prisma.setting.findMany({
      where: { scope: parsedScope },
      orderBy: { key: "asc" },
    });
  }

  async update(ctx: AuthContext, scope: unknown, input: unknown) {
    const parsedScope = settingScopeSchema.parse(scope);
    this.requireManage(ctx, parsedScope);
    const payload = updateSettingsSchema.parse(input);
    const keys = Object.keys(payload);
    const current = await prisma.setting.findMany({ where: { scope: parsedScope, key: { in: keys } } });

    return prisma.$transaction(async (tx) => {
      const saved = [];
      for (const [key, value] of Object.entries(payload)) {
        saved.push(
          await tx.setting.upsert({
            where: { scope_key: { scope: parsedScope, key } },
            update: { value: JSON.parse(JSON.stringify(value)) },
            create: { scope: parsedScope, key, value: JSON.parse(JSON.stringify(value)), sensitive: this.isSensitiveKey(key) },
          }),
        );
      }

      await new AuditService(tx).write({
        ctx,
        domain: parsedScope === "WARUNG" ? "WARUNG" : parsedScope === "BRILINK" ? "BRILINK" : "GLOBAL",
        module: "settings.system",
        action: "update_settings",
        entityType: "setting",
        entityId: parsedScope,
        oldValue: current,
        newValue: saved,
      });
      return saved;
    });
  }

  private requireManage(ctx: AuthContext, scope: SettingScope) {
    const permission = domainScopedPermissions[scope] ?? "settings.system.manage";
    permissionService.require(ctx, permission);
  }

  private isSensitiveKey(key: string) {
    return key.includes("password") || key.includes("secret") || key.includes("token") || key.includes("cash") || key.includes("saldo");
  }
}

export const settingsService = new SettingsService();
