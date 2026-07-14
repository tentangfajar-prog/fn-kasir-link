# Folder Structure — Application

Status: **DRAFT BASELINE**

Recommended structure:

```text
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── warung/
│   ├── brilink/
│   ├── laporan-keuangan/
│   ├── absensi/
│   └── pengaturan/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   ├── filters/
│   ├── charts/
│   └── domain/
│
├── lib/
│   ├── auth/
│   ├── permissions/
│   ├── domain-guard/
│   ├── prisma/
│   ├── validations/
│   ├── formatters/
│   └── errors/
│
├── services/
│   ├── warung/
│   ├── brilink/
│   ├── dashboard/
│   ├── laporan-keuangan/
│   ├── absensi/
│   ├── settings/
│   ├── audit/
│   └── print/
│
├── repositories/
│   ├── warung/
│   ├── brilink/
│   ├── global/
│   └── absensi/
│
└── types/
```

Rules:

- Business rules live in services.
- UI components do not mutate database directly.
- Permission and domain checks happen before data access.
