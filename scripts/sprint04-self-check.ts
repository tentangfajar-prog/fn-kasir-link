import assert from "node:assert/strict";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("warung.pos.use"), true);
assert.equal(permissionCodes.has("warung.sale.cancel"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("warung.pos.use"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.transaction.create"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.pos.use"), false);

console.log("Sprint 04 POS Warung self-check OK");
