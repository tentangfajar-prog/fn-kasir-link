import type { AuthContext } from "@/lib/auth";

export async function requirePermission(_context: AuthContext, _permission: string) {
  throw new Error("Permission engine belum diimplementasikan. Sprint 01 scope.");
}
