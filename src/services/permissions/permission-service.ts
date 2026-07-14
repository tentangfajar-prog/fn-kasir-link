import type { Domain, PermissionEffect } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";
import type { AuthContext } from "@/types/auth";

export class PermissionService {
  isOwner(ctx: AuthContext) {
    return ctx.user.roleCode === "OWNER";
  }

  async getUserPermissions(userId: string): Promise<Record<string, PermissionEffect>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        permissionOverrides: { include: { permission: true } },
      },
    });

    if (!user) return {};

    const result: Record<string, PermissionEffect> = {};
    for (const rolePermission of user.role.permissions) {
      result[rolePermission.permission.code] = rolePermission.effect;
    }
    for (const override of user.permissionOverrides) {
      result[override.permission.code] = override.effect;
    }
    return result;
  }

  hasPermission(ctx: AuthContext, code: string) {
    if (this.isOwner(ctx)) return true;
    return ctx.permissions?.[code] === "ALLOW";
  }

  require(ctx: AuthContext, code: string) {
    if (!this.hasPermission(ctx, code)) {
      throw new ForbiddenError("FORBIDDEN", `Permission dibutuhkan: ${code}`);
    }
  }

  canAccessDomain(ctx: AuthContext, domain: Domain) {
    if (this.isOwner(ctx) || domain === "GLOBAL") return true;
    if (ctx.domains?.includes(domain)) return true;
    if (domain === "WARUNG") return this.hasPermission(ctx, "warung.access");
    if (domain === "BRILINK") return this.hasPermission(ctx, "brilink.access");
    return false;
  }

  requireDomain(ctx: AuthContext, domain: Domain) {
    if (!this.canAccessDomain(ctx, domain)) {
      throw new ForbiddenError("DOMAIN_FORBIDDEN", `Akses domain ${domain} ditolak.`);
    }
  }

  assertCanModifyRole(actor: AuthContext, targetRoleCode: string) {
    if (!this.isOwner(actor) && targetRoleCode === "OWNER") {
      throw new ForbiddenError("FORBIDDEN", "Non-Owner tidak boleh mengubah Owner.");
    }
  }

  assertNoSelfSensitiveGrant(actor: AuthContext, targetUserId: string, hasSensitiveAllow: boolean) {
    if (!this.isOwner(actor) && actor.user.id === targetUserId && hasSensitiveAllow) {
      throw new ForbiddenError("SENSITIVE_PERMISSION_SELF_GRANT_DENIED", "Admin tidak boleh memberi permission sensitif ke diri sendiri.");
    }
  }
}

export const permissionService = new PermissionService();
