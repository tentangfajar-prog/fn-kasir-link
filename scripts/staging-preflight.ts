import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

const envExample = readFileSync(".env.staging.example", "utf8");
const runbook = readFileSync("docs/10-release/Staging-Deploy-Runbook.md", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

assert.equal(existsSync("prisma/migrations/20260714223000_initial/migration.sql"), true);
assert.equal(existsSync("ecosystem.config.cjs"), true);
assert.equal(existsSync("railway.json"), true);
assert.equal(existsSync("docs/10-release/Railway-Staging.md"), true);
assert.match(readFileSync("next.config.ts", "utf8"), /output:\s*["']standalone["']/);
assert.match(envExample, /DATABASE_URL=postgresql:\/\//);
assert.match(envExample, /SEED_OWNER_PASSWORD=/);
assert.doesNotMatch(envExample, /SESSION_SECRET=/);
assert.equal(packageJson.scripts["db:migrate:deploy"], "prisma migrate deploy");
assert.equal(packageJson.scripts["db:push"], undefined);
assert.match(runbook, /pm2 start ecosystem\.config\.cjs/);
assert.match(runbook, /npm run db:migrate:deploy/);
assert.match(runbook, /do not use production database/i);
assert.match(readFileSync("railway.json", "utf8"), /db:migrate:deploy/);

console.log("Staging preflight OK");
