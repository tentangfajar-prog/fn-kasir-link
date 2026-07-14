import assert from "node:assert/strict";
import { PermissionService } from "../src/services/permissions/permission-service";
import type { AuthContext } from "../src/types/auth";

const service = new PermissionService();

const owner: AuthContext = {
  user: { id: "owner", name: "Owner", username: "owner", roleCode: "OWNER", status: "ACTIVE" },
};

const kasirWarung: AuthContext = {
  user: { id: "kasir", name: "Kasir", username: "kasir", roleCode: "KASIR_WARUNG", status: "ACTIVE" },
  permissions: { "warung.access": "ALLOW", "warung.pos.use": "ALLOW", "brilink.access": "DENY" },
};

const admin: AuthContext = {
  user: { id: "admin", name: "Admin", username: "admin", roleCode: "ADMIN", status: "ACTIVE" },
  permissions: { "settings.permission.manage": "ALLOW" },
};

assert.equal(service.hasPermission(owner, "anything.future"), true);
assert.equal(service.canAccessDomain(owner, "BRILINK"), true);
assert.equal(service.canAccessDomain(kasirWarung, "WARUNG"), true);
assert.equal(service.canAccessDomain(kasirWarung, "BRILINK"), false);
assert.throws(() => service.assertCanModifyRole(admin, "OWNER"), /Non-Owner/);
assert.throws(() => service.assertNoSelfSensitiveGrant(admin, "admin", true), /sensitif/);

console.log("Sprint 01 permission self-check OK");
