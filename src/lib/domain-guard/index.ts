import type { Domain } from "@prisma/client";
import { permissionService } from "@/services/permissions/permission-service";
import type { AuthContext } from "@/types/auth";

export function requireDomain(ctx: AuthContext, domain: Domain) {
  return permissionService.requireDomain(ctx, domain);
}

export function canAccessDomain(ctx: AuthContext, domain: Domain) {
  return permissionService.canAccessDomain(ctx, domain);
}
