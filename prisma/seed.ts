import { PrismaClient } from "@prisma/client";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";
import { authService } from "../src/services/auth/auth-service";

const prisma = new PrismaClient();

async function main() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        name: permission.name,
        domain: permission.domain,
        module: permission.module,
        sensitive: Boolean(permission.sensitive),
      },
      create: {
        code: permission.code,
        name: permission.name,
        domain: permission.domain,
        module: permission.module,
        sensitive: Boolean(permission.sensitive),
      },
    });
  }

  const roles = [
    { code: "OWNER", name: "Owner" },
    { code: "ADMIN", name: "Admin" },
    { code: "KASIR_WARUNG", name: "Kasir Warung" },
    { code: "PETUGAS_BRILINK", name: "Petugas BRILink" },
  ];

  for (const role of roles) {
    const savedRole = await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name, isSystem: true },
      create: { code: role.code, name: role.name, isSystem: true },
    });

    const codes = ROLE_PERMISSION_CODES[role.code] ?? [];
    const permissions = await prisma.permission.findMany({ where: { code: { in: codes } } });
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: savedRole.id, permissionId: permission.id } },
        update: { effect: "ALLOW" },
        create: { roleId: savedRole.id, permissionId: permission.id, effect: "ALLOW" },
      });
    }
  }

  const ownerRole = await prisma.role.findUniqueOrThrow({ where: { code: "OWNER" } });
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "ChangeMe12345";
  await prisma.user.upsert({
    where: { username: "owner" },
    update: { roleId: ownerRole.id, status: "ACTIVE" },
    create: {
      name: "Owner",
      username: "owner",
      roleId: ownerRole.id,
      status: "ACTIVE",
      passwordHash: await authService.hashPassword(ownerPassword),
      mustChangePassword: true,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
