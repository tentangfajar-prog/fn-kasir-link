import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit/audit-service";
import { permissionService } from "@/services/permissions/permission-service";
import type { AuthContext } from "@/types/auth";

export class RolePermissionService {
  async updateRolePermissions(ctx: AuthContext, roleId: string, permissions: { code: string; allow: boolean }[]) {
    permissionService.require(ctx, "settings.permission.manage");
    const role = await prisma.role.findUniqueOrThrow({ where: { id: roleId } });
    permissionService.assertCanModifyRole(ctx, role.code);

    const codes = permissions.map((permission) => permission.code);
    const records = await prisma.permission.findMany({ where: { code: { in: codes } } });
    const byCode = new Map(records.map((record) => [record.code, record]));

    return prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      await tx.rolePermission.createMany({
        data: permissions
          .filter((permission) => byCode.has(permission.code))
          .map((permission) => ({ roleId, permissionId: byCode.get(permission.code)!.id, effect: permission.allow ? "ALLOW" : "DENY" })),
      });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "settings.permission", action: "update_role_permissions", entityType: "role", entityId: roleId, newValue: permissions });
    });
  }

  async setUserOverrides(ctx: AuthContext, userId: string, overrides: { code: string; effect: "ALLOW" | "DENY" }[]) {
    permissionService.require(ctx, "settings.permission.manage");
    const target = await prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { role: true } });
    permissionService.assertCanModifyRole(ctx, target.role.code);

    const records = await prisma.permission.findMany({ where: { code: { in: overrides.map((override) => override.code) } } });
    const byCode = new Map(records.map((record) => [record.code, record]));
    const hasSensitiveAllow = overrides.some((override) => override.effect === "ALLOW" && byCode.get(override.code)?.sensitive);
    permissionService.assertNoSelfSensitiveGrant(ctx, userId, hasSensitiveAllow);

    return prisma.$transaction(async (tx) => {
      await tx.userPermissionOverride.deleteMany({ where: { userId } });
      await tx.userPermissionOverride.createMany({
        data: overrides
          .filter((override) => byCode.has(override.code))
          .map((override) => ({ userId, permissionId: byCode.get(override.code)!.id, effect: override.effect })),
      });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "settings.permission", action: "set_user_overrides", entityType: "user", entityId: userId, newValue: overrides });
    });
  }
}

export const rolePermissionService = new RolePermissionService();
