# Deployment Guide

Status: **DRAFT BASELINE**

## Recommended Deployment

V1 should be Docker-ready.

Basic components:

```text
App container
PostgreSQL database
Reverse proxy
HTTPS
Persistent upload storage
Backup job
```

## Deployment Steps

1. Backup database.
2. Pull latest release.
3. Install dependencies.
4. Run migrations.
5. Seed required system data if needed.
6. Restart app.
7. Run smoke test.

## Smoke Test After Deploy

- Owner login.
- Kasir Warung cannot access BRILink.
- Petugas BRILink cannot access Warung.
- POS basic flow.
- BRILink basic flow.
- Dashboard loads.
- Audit Log records actions.
