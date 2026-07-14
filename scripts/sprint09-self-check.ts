import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const dashboard = readFileSync("src/services/reports/dashboard-service.ts", "utf8");
const financialReport = readFileSync("src/services/reports/financial-report-service.ts", "utf8");
const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("dashboard.view"), true);
assert.equal(permissionCodes.has("laporan-keuangan.view"), true);
assert.equal(ROLE_PERMISSION_CODES.OWNER.includes("dashboard.view"), true);
assert.equal(ROLE_PERMISSION_CODES.ADMIN.includes("laporan-keuangan.view"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("laporan-keuangan.view"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("dashboard.view"), false);
assert.match(dashboard, /getOwnerSummary/);
assert.match(dashboard, /getDailyChart/);
assert.match(dashboard, /getMonthlyChart/);
assert.match(dashboard, /brilinkFeeLedger/);
assert.match(dashboard, /warungSale/);
assert.doesNotMatch(dashboard, /\.create\(/);
assert.match(financialReport, /getSummary/);
assert.match(financialReport, /getAssetLiquidity/);
assert.match(financialReport, /getDebtAndPayables/);
assert.match(financialReport, /getTemporaryFunds/);
assert.match(financialReport, /brilinkDanaLuar/);
assert.match(financialReport, /warungSupplierDebt/);
assert.doesNotMatch(financialReport, /\.create\(/);

console.log("Sprint 09 dashboard reports self-check OK");
