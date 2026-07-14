import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const apiForm = readFileSync("src/components/domain/api-json-form.tsx", "utf8");
const loginForm = readFileSync("src/components/forms/login-form.tsx", "utf8");
const pages = [
  "src/app/auth/login/page.tsx",
  "src/app/warung/pos/page.tsx",
  "src/app/warung/expenses/page.tsx",
  "src/app/warung/purchases/page.tsx",
  "src/app/brilink/transactions/page.tsx",
  "src/app/brilink/temporary-funds/page.tsx",
  "src/app/absensi/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/laporan-keuangan/page.tsx",
];

assert.match(apiForm, /fetch\(endpoint/);
assert.match(apiForm, /JSON\.stringify/);
assert.match(loginForm, /\/api\/auth\/login/);
assert.match(loginForm, /type="password"/);

for (const page of pages) {
  const text = readFileSync(page, "utf8");
  assert.doesNotMatch(text, /PlaceholderPage/, `${page} still uses placeholder`);
  assert.match(text, /ApiJsonForm|LoginForm/, `${page} missing working form component`);
}

console.log("Sprint 13 UI form self-check OK");
