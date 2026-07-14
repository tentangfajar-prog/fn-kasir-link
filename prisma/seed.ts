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

  await prisma.setting.upsert({
    where: { scope_key: { scope: "GLOBAL", key: "app.name" } },
    update: { value: "FN Kasir Link" },
    create: { scope: "GLOBAL", key: "app.name", value: "FN Kasir Link" },
  });

  await prisma.documentSequence.upsert({
    where: { domain_code: { domain: "WARUNG", code: "SALE" } },
    update: { prefix: "WRG-" },
    create: { domain: "WARUNG", code: "SALE", prefix: "WRG-" },
  });

  await prisma.documentSequence.upsert({
    where: { domain_code: { domain: "BRILINK", code: "TRX" } },
    update: { prefix: "BRI-" },
    create: { domain: "BRILINK", code: "TRX", prefix: "BRI-" },
  });


  const transferOutTemplate = await prisma.brilinkCashSaldoTemplate.upsert({
    where: { code: "CASH_IN_SALDO_OUT" },
    update: {
      name: "Cash In Nominal + Fee, Saldo Out Nominal",
      cashDirection: "IN",
      cashAmountFormula: "NOMINAL_PLUS_FEE",
      saldoDirection: "OUT",
      saldoAmountFormula: "NOMINAL",
    },
    create: {
      code: "CASH_IN_SALDO_OUT",
      name: "Cash In Nominal + Fee, Saldo Out Nominal",
      cashDirection: "IN",
      cashAmountFormula: "NOMINAL_PLUS_FEE",
      saldoDirection: "OUT",
      saldoAmountFormula: "NOMINAL",
    },
  });

  const cashOutTemplate = await prisma.brilinkCashSaldoTemplate.upsert({
    where: { code: "CASH_OUT_SALDO_IN_FEE" },
    update: {
      name: "Cash Out Nominal, Cash In Fee, Saldo In Nominal",
      cashDirection: "OUT",
      cashAmountFormula: "NOMINAL",
      saldoDirection: "IN",
      saldoAmountFormula: "NOMINAL",
    },
    create: {
      code: "CASH_OUT_SALDO_IN_FEE",
      name: "Cash Out Nominal, Cash In Fee, Saldo In Nominal",
      cashDirection: "OUT",
      cashAmountFormula: "NOMINAL",
      saldoDirection: "IN",
      saldoAmountFormula: "NOMINAL",
    },
  });

  const transactionTypes = [
    { code: "TRANSFER", name: "Transfer", templateId: transferOutTemplate.id, sortOrder: 1 },
    { code: "SETOR_TUNAI", name: "Setor Tunai", templateId: transferOutTemplate.id, sortOrder: 2 },
    { code: "TARIK_TUNAI", name: "Tarik Tunai", templateId: cashOutTemplate.id, sortOrder: 3 },
    { code: "TOP_UP", name: "Top Up", templateId: transferOutTemplate.id, sortOrder: 4 },
  ];

  for (const type of transactionTypes) {
    const savedType = await prisma.brilinkTransactionType.upsert({
      where: { code: type.code },
      update: { name: type.name, templateId: type.templateId, sortOrder: type.sortOrder, isActive: true },
      create: type,
    });
    const group = await prisma.brilinkTariffGroup.upsert({
      where: { transactionTypeId_bankCategory: { transactionTypeId: savedType.id, bankCategory: "DEFAULT" } },
      update: { name: "Default", isActive: true },
      create: { transactionTypeId: savedType.id, bankCategory: "DEFAULT", name: "Default" },
    });
    const existing = await prisma.brilinkTariffRange.findFirst({ where: { tariffGroupId: group.id, minAmount: 0, maxAmount: null } });
    if (!existing) {
      await prisma.brilinkTariffRange.create({ data: { tariffGroupId: group.id, minAmount: 0, maxAmount: null, feeAmount: 5000 } });
    }
  }

  const ownerRole = await prisma.role.findUniqueOrThrow({ where: { code: "OWNER" } });
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? (process.env.NODE_ENV === "production" ? undefined : "ChangeMe12345");
  if (!ownerPassword) throw new Error("SEED_OWNER_PASSWORD is required when seeding production.");
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
