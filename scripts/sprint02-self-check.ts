import assert from "node:assert/strict";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("settings.partner.manage"), true);
assert.equal(permissionCodes.has("settings.system.manage"), true);
assert.equal(ROLE_PERMISSION_CODES.OWNER.length, PERMISSIONS.length);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.access"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.access"), false);

console.log("Sprint 02 global master self-check OK");
