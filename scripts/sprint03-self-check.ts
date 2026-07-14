import assert from "node:assert/strict";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("warung.product.manage"), true);
assert.equal(permissionCodes.has("warung.stock.view"), true);
assert.equal(permissionCodes.has("warung.stock.opname"), true);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.stock.view"), false);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.access"), false);

console.log("Sprint 03 warung product stock self-check OK");
