import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const service = readFileSync("src/services/brilink/temporary-funds/brilink-temporary-fund-service.ts", "utf8");
const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("brilink.temporary_fund.manage"), true);
assert.equal(ROLE_PERMISSION_CODES.ADMIN.includes("brilink.temporary_fund.manage"), true);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("brilink.temporary_fund.manage"), false);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.temporary_fund.manage"), false);
assert.match(schema, /enum BrilinkFundAccount/);
assert.match(schema, /enum BrilinkTemporaryFundStatus/);
assert.match(schema, /model BrilinkDanaLuar /);
assert.match(schema, /model BrilinkDanaLuarReturn /);
assert.match(schema, /model BrilinkInjection /);
assert.match(schema, /model BrilinkInjectionReturn /);
assert.match(service, /prisma\.\$transaction/);
assert.match(service, /createDanaLuar/);
assert.match(service, /returnDanaLuar/);
assert.match(service, /createInjection/);
assert.match(service, /returnInjection/);
assert.match(service, /brilinkCashLedger\.create/);
assert.match(service, /brilinkSaldoLedger\.create/);
assert.match(service, /AuditService/);
assert.match(service, /ensureBalance/);

console.log("Sprint 08 BRILink advanced self-check OK");
