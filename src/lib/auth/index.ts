import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { AuthContext } from "@/types/auth";
import { permissionService } from "@/services/permissions/permission-service";

export const SESSION_COOKIE = "fn_kasir_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

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

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.apiSession.create({ data: { tokenHash: hashSessionToken(token), userId, expiresAt } });
  return { token, expiresAt };
}

export async function revokeSession(token: string) {
  await prisma.apiSession.updateMany({ where: { tokenHash: hashSessionToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
}

export async function requireAuth(): Promise<AuthContext> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) throw new AppError("UNAUTHENTICATED", "Silakan login dulu.");
  const session = await prisma.apiSession.findUnique({ where: { tokenHash: hashSessionToken(token) }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) throw new AppError("UNAUTHENTICATED", "Sesi tidak valid atau kedaluwarsa.");
  if (session.user.status !== "ACTIVE") throw new AppError("USER_INACTIVE", "User tidak aktif.");
  return buildAuthContext(session.user);
}
