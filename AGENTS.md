# AGENTS.md

## Cursor Cloud specific instructions

Bel Âge Pâtisserie is a single Vite + React app with Vercel serverless APIs under `api/` (training auth + Stripe). See `README.md` for architecture, env vars, and training-user CLI.

### Run locally

- **UI-only:** `npm run dev` (or `npm run dev:vite`) — React only; `/api/*` will not work.
- **Full stack (preferred for training login / Stripe):** `npm run dev:vercel` — requires Vercel CLI auth (`vercel login` or `VERCEL_TOKEN`). The CLI prints the local URL (often `http://localhost:3000`).
- Before either, copy `.env.example` → `.env.local` and set at least `TRAINING_SESSION_SECRET` (≥32 chars). Stripe keys are optional unless testing checkout.

### Lint / test / build

- `npm run lint` — ESLint; the repo currently reports many pre-existing lint errors (unused React imports, hooks rules, etc.). Do not treat a non-zero lint exit as an environment-setup failure.
- Automated tests: **none** in this repo.
- `npm run build` — Vite production build; should succeed after `npm install`.

### Gotchas

- `npx vercel` may prompt to install the package interactively; prefer a logged-in Vercel CLI or set `VERCEL_TOKEN` so `npm run dev:vercel` is non-interactive.
- Training users live in `server/training/users.json`. Creating/updating users via `npm run training:user:*` modifies that file and requires commit + deploy for production. Do not leave ephemeral test users committed unless intentional.
- Stripe checkout returns 503 without `STRIPE_SECRET_KEY`; webhook confirmation needs `STRIPE_WEBHOOK_SECRET`.
- Do not put paid videos in `public/`; the video API is access-gated but private storage is not wired yet.
