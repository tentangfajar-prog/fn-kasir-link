import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const service = readFileSync("src/services/brilink/core/brilink-core-service.ts", "utf8");
const seed = readFileSync("prisma/seed.ts", "utf8");
const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("brilink.transaction.create"), true);
assert.equal(permissionCodes.has("brilink.tariff.manage"), true);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("brilink.transaction.create"), true);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("brilink.tariff.manage"), false);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.transaction.create"), false);
assert.match(schema, /model BrilinkCashSaldoTemplate /);
assert.match(schema, /model BrilinkTransactionType /);
assert.match(schema, /model BrilinkTariffGroup /);
assert.match(schema, /model BrilinkTariffRange /);
assert.match(schema, /model BrilinkTransaction /);
assert.match(schema, /model BrilinkCashLedger /);
assert.match(schema, /model BrilinkSaldoLedger /);
assert.match(schema, /model BrilinkFeeLedger /);
assert.match(service, /prisma\.\$transaction/);
assert.match(service, /brilinkCashLedger\.create/);
assert.match(service, /brilinkSaldoLedger\.create/);
assert.match(service, /brilinkFeeLedger\.create/);
assert.match(service, /AuditService/);
assert.match(service, /validateNoOverlap/);
assert.match(seed, /TRANSFER/);
assert.match(seed, /SETOR_TUNAI/);
assert.match(seed, /TARIK_TUNAI/);
assert.match(seed, /TOP_UP/);

console.log("Sprint 07 BRILink core self-check OK");
