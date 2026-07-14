import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { buildAuthContext } from "@/lib/auth";
import { loginSchema, changePasswordSchema } from "@/lib/validations/auth";
import type { AuthContext } from "@/types/auth";

const encoder = new TextEncoder();
const SCRYPT_KEY_LENGTH = 64;

function randomToken(bytes = 16) {
  const data = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(data);
  return Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toHex(data: ArrayBuffer) {
  return Array.from(new Uint8Array(data), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  return toHex(await globalThis.crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function scrypt(password: string, salt: string) {
  const { scrypt: nodeScrypt } = await import("node:crypto");
  return await new Promise<string>((resolve, reject) => {
    nodeScrypt(password, salt, SCRYPT_KEY_LENGTH, (error, key) => (error ? reject(error) : resolve(key.toString("hex"))));
  });
}

async function hashPassword(password: string) {
  const salt = randomToken();
  return `scrypt:${salt}:${await scrypt(password, salt)}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, digest] = storedHash.split(":");
  if (!salt || !digest) return false;
  if (algorithm === "scrypt") return (await scrypt(password, salt)) === digest;
  if (algorithm === "sha256") return (await sha256(`${salt}:${password}`)) === digest;
  return false;
}

export class AuthService {
  async login(input: unknown) {
    const payload = loginSchema.parse(input);
    const user = await prisma.user.findUnique({ where: { username: payload.username } });

    if (!user) {
      await prisma.loginHistory.create({ data: { username: payload.username, success: false, reason: "INVALID_CREDENTIALS" } });
      throw new AppError("INVALID_CREDENTIALS", "Username atau password salah.");
    }

    if (user.status !== "ACTIVE") {
      await prisma.loginHistory.create({ data: { userId: user.id, username: user.username, success: false, reason: "USER_INACTIVE" } });
      throw new AppError("USER_INACTIVE", "User tidak aktif.");
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      await prisma.loginHistory.create({ data: { userId: user.id, username: user.username, success: false, reason: "INVALID_CREDENTIALS" } });
      throw new AppError("INVALID_CREDENTIALS", "Username atau password salah.");
    }

    await prisma.loginHistory.create({ data: { userId: user.id, username: user.username, success: true } });
    const ctx = await buildAuthContext(user);
    await new AuditService().write({ ctx, domain: "GLOBAL", module: "auth", action: "login", entityType: "user", entityId: user.id });

    return { user, ctx, mustChangePassword: user.mustChangePassword };
  }

  async changePassword(ctx: AuthContext, input: unknown) {
    const payload = changePasswordSchema.parse(input);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: ctx.user.id } });
    const valid = await verifyPassword(payload.old_password, user.passwordHash);
    if (!valid) throw new AppError("INVALID_CREDENTIALS", "Password lama salah.");

    const passwordHash = await hashPassword(payload.new_password);
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { passwordHash, mustChangePassword: false } });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "auth", action: "change_password", entityType: "user", entityId: user.id });
    });
  }

  generateTemporaryPassword() {
    return randomToken(12);
  }

  hashPassword(password: string) {
    return hashPassword(password);
  }
}

export const authService = new AuthService();
