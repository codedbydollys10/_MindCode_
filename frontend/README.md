# MindCode Frontend

## Environment
Copy `.env.example` to `.env` and set:
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_REDIRECT_TO` (e.g. `http://localhost:5173/dashboard`)
- `VITE_CODE_RUNNER_URL` (e.g. `https://mind-code-gilt.vercel.app`)

## Auth
Google and GitHub OAuth go through Supabase. Auth events upsert to `public.user_profiles`; apply `supabase_schema.sql` in your project SQL editor to create policies.

## Code runner
`Assessment` page calls the backend Judge0 proxy at `VITE_CODE_RUNNER_URL` to execute code for Python/JS/Java/C++.
