import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const service = readFileSync("src/services/warung/purchase/warung-purchase-service.ts", "utf8");
const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("warung.purchase.create"), true);
assert.equal(permissionCodes.has("warung.debt.pay"), true);
assert.equal(ROLE_PERMISSION_CODES.ADMIN.includes("warung.purchase.create"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("warung.purchase.create"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.debt.pay"), false);
assert.match(schema, /model WarungPurchase /);
assert.match(schema, /model WarungPurchaseItem /);
assert.match(schema, /model WarungSupplierDebt /);
assert.match(schema, /model WarungSupplierDebtPayment /);
assert.match(service, /prisma\.\$transaction/);
assert.match(service, /warungStockMovement\.create/);
assert.match(service, /warungCashLedger\.create/);
assert.match(service, /AuditService/);
assert.match(service, /weightedAverageHpp/);

console.log("Sprint 06 Warung advanced self-check OK");
