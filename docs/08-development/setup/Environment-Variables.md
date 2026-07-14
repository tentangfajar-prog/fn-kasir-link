# Environment Variables

Status: **DRAFT BASELINE**

Recommended env vars:

```env
DATABASE_URL=
APP_URL=
SESSION_SECRET=
NODE_ENV=

DEFAULT_TIMEZONE=Asia/Jakarta
DEFAULT_CURRENCY=IDR

UPLOAD_STORAGE_PATH=
MAX_UPLOAD_SIZE_MB=5

PRINT_FEATURE_ENABLED=true
BARCODE_CAMERA_ENABLED=true

ATTENDANCE_QR_TTL_SECONDS=60
ATTENDANCE_QR_REFRESH_SECONDS=60
```

Rules:

- Never commit `.env`.
- Provide `.env.example`.
- Production secrets must not be stored in repository.
