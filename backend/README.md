# SkillDNA Editor Backend

Simple Express proxy to Judge0 CE used by the frontend code runner.

## Setup
1) Copy `.env.example` to `.env` and set `JUDGE0_URL` and optional `JUDGE0_TOKEN`.
2) Install dependencies: `npm install` (or `pnpm install` / `yarn install`).
3) Run locally: `npm run dev` (defaults to `http://localhost:3001`).

The frontend reads `VITE_CODE_RUNNER_URL` and points to this server.

### Supabase health check
If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, hit `GET /health/supabase` to verify connectivity and see the `user_profiles` row count.
