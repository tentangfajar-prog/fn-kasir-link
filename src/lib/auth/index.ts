import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuthContext } from "@/types/auth";
import { permissionService } from "@/services/permissions/permission-service";

export async function buildAuthContext(user: User): Promise<AuthContext> {
  const role = await prisma.role.findUniqueOrThrow({ where: { id: user.roleId } });
  const permissions = await permissionService.getUserPermissions(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      roleCode: role.code,
      status: user.status,
    },
    permissions,
  };
}

export async function requireAuth(): Promise<AuthContext> {
  throw new Error("Session auth belum diimplementasikan. Sprint 01 menyiapkan core, wiring session menyusul saat route handler auth dibuat.");
}
