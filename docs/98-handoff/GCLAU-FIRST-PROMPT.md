# GCLAU FIRST PROMPT

Copy this prompt into Gclau when starting the project.

---

You are working on the FN Kasir Link repository.

Before coding, read the project documentation.

Read these files first, in order:

1. README.md
2. START-HERE-FOR-GCLAU.md
3. docs/00-project/Project-Overview.md
4. docs/00-project/Scope-V1.md
5. docs/00-project/Decision-Log.md
6. docs/00-project/Tech-Stack-Decision.md
7. docs/01-business/Domain-Separation.md
8. docs/01-business/Roles-And-Permissions.md
9. docs/01-architecture/Application-Architecture.md
10. docs/01-architecture/Folder-Structure.md
11. docs/01-architecture/Service-Layer-Design.md
12. docs/08-development/Sprint-Plan.md
13. docs/08-development/Coding-Standards.md

After reading, start Sprint 00 only.

Sprint 00 scope:

- Setup Next.js + TypeScript.
- Setup Tailwind CSS.
- Setup shadcn/ui.
- Setup Prisma.
- Setup PostgreSQL config.
- Create folder structure following docs/01-architecture/Folder-Structure.md.
- Create AppShell layout.
- Create Sidebar and Topbar skeleton.
- Create basic route placeholders:
  - /dashboard
  - /warung
  - /warung/panel
  - /warung/pos
  - /brilink
  - /brilink/panel
  - /brilink/transaksi-baru
  - /laporan-keuangan
  - /absensi
  - /pengaturan
- Create .env.example.
- Do not implement business features yet.
- Do not implement POS checkout yet.
- Do not implement BRILink transaction yet.
- Do not implement dashboard charts yet.
- Do not implement full permission engine yet.
- Make sure the app runs locally.

Important project rule:

Warung and BRILink must stay separated in menu, route, permission, ledger, cash, capital, closing, report, and data scope.

When finished, summarize:
1. Files created.
2. How to run locally.
3. What is intentionally not implemented.
4. Next recommended sprint.
