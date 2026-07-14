import assert from "node:assert/strict";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("warung.finance.view"), true);
assert.equal(permissionCodes.has("warung.expense.create"), true);
assert.equal(permissionCodes.has("warung.cash.transfer"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("warung.expense.create"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("warung.cash.transfer"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.finance.view"), false);

console.log("Sprint 05 Warung finance daily self-check OK");
