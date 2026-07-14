import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const service = readFileSync("src/services/consignment/consignment-service.ts", "utf8");
const print = readFileSync("src/services/print/print-service.ts", "utf8");
const report = readFileSync("src/services/reports/financial-report-service.ts", "utf8");
const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("warung.consignment.manage"), true);
assert.equal(permissionCodes.has("brilink.consignment.manage"), true);
assert.equal(permissionCodes.has("print.reprint"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("warung.consignment.manage"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("brilink.consignment.manage"), false);
assert.match(schema, /model ConsignmentEntry /);
assert.match(schema, /model ConsignmentPayment /);
assert.match(schema, /model ConsignmentReturn /);
assert.match(service, /createEntry/);
assert.match(service, /payConsignor/);
assert.match(service, /returnUnsold/);
assert.match(service, /warungCashLedger\.create/);
assert.match(service, /brilinkCashLedger\.create/);
assert.match(print, /printLog\.create/);
assert.match(print, /warung_sale/);
assert.match(print, /brilink_transaction/);
assert.match(report, /consignmentEntry/);

console.log("Sprint 15 consignment print self-check OK");
