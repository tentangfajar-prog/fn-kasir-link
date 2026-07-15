import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

const envExample = readFileSync(".env.staging.example", "utf8");
const runbook = readFileSync("docs/10-release/Staging-Deploy-Runbook.md", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

assert.equal(existsSync("prisma/migrations/20260715030000_initial_mysql/migration.sql"), true);
assert.match(readFileSync("prisma/migrations/migration_lock.toml", "utf8"), /provider = "mysql"/);
assert.equal(existsSync("ecosystem.config.cjs"), true);
assert.equal(existsSync("railway.json"), true);
assert.equal(existsSync("Dockerfile"), true);
assert.equal(existsSync(".dockerignore"), true);
assert.equal(existsSync("docs/10-release/Niagahoster-Hosting.md"), true);
assert.match(readFileSync("next.config.ts", "utf8"), /standalone/);
assert.match(readFileSync("prisma/schema.prisma", "utf8"), /provider = "mysql"/);
assert.match(envExample, /DATABASE_URL=mysql:\/\//);
assert.match(envExample, /SEED_OWNER_PASSWORD=/);
assert.doesNotMatch(envExample, /SESSION_SECRET=/);
assert.equal(packageJson.scripts["start"], "node .next/standalone/server.js");
assert.equal(packageJson.scripts["db:migrate:deploy"], "prisma migrate deploy");
assert.equal(packageJson.scripts["db:push"], undefined);
assert.match(runbook, /pm2 start ecosystem\.config\.cjs/);
assert.match(runbook, /npm run db:migrate:deploy/);
assert.match(runbook, /do not use production database/i);
assert.match(readFileSync("railway.json", "utf8"), /DOCKERFILE/);
assert.match(readFileSync("Dockerfile", "utf8"), /CMD \["npm", "start"\]/);

console.log("Staging preflight OK");
