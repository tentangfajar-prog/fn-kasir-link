import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";
import { createUserSchema, updateUserSchema } from "@/lib/validations/users";
import { AuditService } from "@/services/audit/audit-service";
import { authService } from "@/services/auth/auth-service";
import { permissionService } from "@/services/permissions/permission-service";
import type { AuthContext } from "@/types/auth";

export class UserService {
  async create(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "settings.user.create");
    const payload = createUserSchema.parse(input);
    const role = await prisma.role.findUniqueOrThrow({ where: { id: payload.role_id } });
    permissionService.assertCanModifyRole(ctx, role.code);

    const temporaryPassword = authService.generateTemporaryPassword();
    const passwordHash = await authService.hashPassword(temporaryPassword);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: payload.name,
          username: payload.username,
          phone: payload.phone,
          email: payload.email,
          roleId: payload.role_id,
          status: payload.status,
          passwordHash,
          mustChangePassword: true,
        },
      });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "settings.user", action: "create", entityType: "user", entityId: created.id, newValue: { username: created.username, role: role.code } });
      return created;
    });

    return { user, temporaryPassword };
  }

  async update(ctx: AuthContext, userId: string, input: unknown) {
    permissionService.require(ctx, "settings.user.create");
    const payload = updateUserSchema.parse(input);
    const current = await prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { role: true } });
    permissionService.assertCanModifyRole(ctx, current.role.code);

    if (payload.role_id) {
      const nextRole = await prisma.role.findUniqueOrThrow({ where: { id: payload.role_id } });
      permissionService.assertCanModifyRole(ctx, nextRole.code);
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          name: payload.name,
          username: payload.username,
          phone: payload.phone,
          email: payload.email,
          roleId: payload.role_id,
          status: payload.status,
        },
      });
      await new AuditService(tx).write({
        ctx,
        domain: "GLOBAL",
        module: "settings.user",
        action: "update",
        entityType: "user",
        entityId: userId,
        oldValue: { id: current.id, name: current.name, username: current.username, roleId: current.roleId, status: current.status },
        newValue: { id: updated.id, name: updated.name, username: updated.username, roleId: updated.roleId, status: updated.status },
      });
      return updated;
    });
  }

  async deactivate(ctx: AuthContext, userId: string) {
    permissionService.require(ctx, "settings.user.create");
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { role: true } });
    permissionService.assertCanModifyRole(ctx, user.role.code);

    if (user.role.code === "OWNER") {
      const ownerCount = await prisma.user.count({ where: { role: { code: "OWNER" }, status: "ACTIVE" } });
      if (ownerCount <= 1) {
        throw new ForbiddenError("OWNER_LAST_ACCOUNT_PROTECTED", "Owner terakhir tidak boleh dinonaktifkan.");
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({ where: { id: userId }, data: { status: "INACTIVE" } });
      await new AuditService(tx).write({
        ctx,
        domain: "GLOBAL",
        module: "settings.user",
        action: "deactivate",
        entityType: "user",
        entityId: userId,
        oldValue: { id: user.id, username: user.username, status: user.status },
        newValue: { id: updated.id, username: updated.username, status: updated.status },
      });
      return updated;
    });
  }
}

export const userService = new UserService();
