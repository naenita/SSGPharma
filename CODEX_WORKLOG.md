# Codex Worklog

## Status

- [x] Repository structure reviewed
- [x] Local Next app-router docs reviewed
- [x] Prisma/auth/admin API flow reviewed
- [x] Division page/server fixes applied
- [x] Admin dashboard rebuilt
- [x] Unsplash references replaced
- [x] Change-password route aligned with live auth
- [x] Build verified

## Notes

- `lib/prisma.ts` already exists and is the shared Prisma singleton.
- The live auth flow used a session cookie plus `ADMIN_PASSWORD` in `.env`, while `AdminUser` existed in Prisma but was not wired into login.
- Public catalog pages still referenced a removed `Medicine` Prisma model and old `imageUrl` / `inStock` fields.
- Added `app/api/admin/contacts/route.ts` so the rebuilt Contacts tab can show inquiry submissions.
- Added `bcryptjs` and connected login plus password change to the database-backed admin flow with an env-password bootstrap fallback.
- Final verification checks passed and `pnpm build` completed successfully.
- Seeded and verified the 6 starter product categories in SQLite: Oncology, Rheumatology, Diabetes, Nephrology, Antibiotics, Vaccines.
- Wired the frontend contact page, footer, floating inquiry widget, and quote form to the shared contact config source instead of hardcoded strings.
- Added admin contact editing for company info, address, hours, phone numbers, and emails, and cleaned duplicate seeded contact rows from the local database.
