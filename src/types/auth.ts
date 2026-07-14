import type { Domain, PermissionEffect, UserStatus } from "@prisma/client";

export type RoleCode = "OWNER" | "ADMIN" | "KASIR_WARUNG" | "PETUGAS_BRILINK";

export type AuthContext = {
  user: {
    id: string;
    name: string;
    username: string;
    roleCode: RoleCode | string;
    status: UserStatus;
  };
  permissions?: Record<string, PermissionEffect>;
  domains?: Domain[];
};

export type PermissionCode = string;
