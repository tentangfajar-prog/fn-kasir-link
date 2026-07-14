# GitHub Setup Steps — FN Kasir Link

Status: **FINAL HANDOFF V1**

## Step 1 — Create GitHub Repository

Repository name:

```text
fn-kasir-link
```

Recommended visibility:

```text
Private
```

## Step 2 — Upload Documentation

Upload all files from the FN Kasir Link documentation package into the repository.

Make sure these files exist at root:

```text
README.md
START-HERE-FOR-GCLAU.md
CHANGELOG.md
ROADMAP.md
MANIFEST.md
docs/
database/
app/
scripts/
```

## Step 3 — Give Gclau Access

Give Gclau access to the repository.

Tell Gclau to start from:

```text
START-HERE-FOR-GCLAU.md
```

## Step 4 — Ask Gclau to Run Sprint 00

Use the prompt from:

```text
docs/98-handoff/GCLAU-FIRST-PROMPT.md
```

## Step 5 — Do Not Connect Domain Yet

Do not connect production domain before:

```text
Sprint 00 completed
Sprint 01 auth completed
Basic route protection exists
Environment config is clear
Deployment guide is tested
```

Domain setup should happen later during deployment preparation.

## Recommended Order

```text
GitHub repo first
Documentation upload
Gclau reads docs
Sprint 00 foundation
Sprint 01 auth/permission
Then staging deployment/domain
```

Do not start with domain. A domain without app foundation is just a fancy address pointing to nothing. Stylish, but useless.
