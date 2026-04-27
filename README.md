# MindCode

MindCode is an AI-powered coding assessment platform with proctoring, behavioral telemetry, cognitive scoring, and recruiter-facing evaluation workflows.

## What This Project Does

MindCode lets a candidate:
- Start a timed coding assessment by language and difficulty
- Solve coding problems in a Monaco editor
- Run code against sample input via Judge0
- Submit final code for full analysis
- Get a result page with skill radar, heatmap, behavioral timeline, and AI feedback

MindCode lets recruiters/instructors:
- View cognitive reports
- Compare candidate attempts
- Review AI-generated strengths, weak areas, and recommended practice plans

## Core Features

- Fullscreen locked assessment mode with anti-cheat guards
- Webcam-based head-position monitoring (TensorFlow.js + BlazeFace)
- Keystroke telemetry collection (speed, pauses, backspaces, rewrites, hesitations)
- Behavioral timeline and line-level struggle heatmap
- Skill scoring across:
  - Problem Solving
  - Debugging
  - Focus
  - Planning
  - Adaptability/Flexibility
- AI report + recommendation generation
- Judge0 execution integration for multi-language code run
- Supabase-backed persistence for users, tests, telemetry, submissions, reports, recommendations
- PDF report export from result screen

## AI Report Generation

- The project report/recommendation pipeline is designed around a Gemini AI API workflow for narrative report generation.
- AI summary blocks (behavioral story, growth feedback, study plan, recommendations) are generated and persisted in the `recommendations` table.
- The result page reads and renders these AI outputs directly.

## Tech Stack

Frontend:
- React + TypeScript + Vite
- TailwindCSS + shadcn/ui + Radix UI
- Zustand (session/report state)
- Monaco Editor
- Recharts
- TensorFlow.js + BlazeFace

Backend:
- Node.js + Express
- Supabase JS client (service-role access)
- Judge0 API proxy for code execution
- LLM integration for question generation and recommendations

Data & Infra:
- Supabase Postgres
- Supabase Auth (OAuth / email flows in app)

## Project Structure

```text
mind_code_new/
├── backend/
│   ├── server.js                  # Main API server (Judge0 proxy + telemetry + reports + recommendations)
│   ├── lib/
│   │   ├── keystrokeDatabase.mjs  # Keystroke persistence helpers
│   │   └── keystrokeRoutes.mjs    # Keystroke API routes
│   ├── scripts/
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Assessment.tsx     # Exam UI, timer, proctoring and submission flow
│   │   │   └── Result.tsx         # Radar, insights, verdict, and report rendering
│   │   ├── hooks/
│   │   │   ├── useAssessmentSession.ts
│   │   │   └── useKeystrokeTracker.ts
│   │   ├── components/
│   │   └── lib/
│   ├── supabase_schema.sql
│   ├── package.json
│   └── README.md
├── scripts/
│   └── dev.mjs                    # Run backend + frontend together
├── keystroke_logs_migration.sql
└── README.md
```

## Main User Flow

1. User starts assessment from dashboard.
2. Frontend creates/loads session and opens timed assessment screen.
3. Keystroke + behavior + proctoring telemetry is continuously captured.
4. User runs sample code through backend `/run` endpoint (Judge0).
5. On submit:
   - Submission is saved
   - Backend generates cognitive report (`/generate-report`)
   - Backend generates AI recommendations (`/generate-recommendations`)
6. Result page loads persisted report + AI feedback from Supabase.

## Key Backend Endpoints

- `POST /run`  
  Execute code using Judge0.

- `POST /question`  
  Generate assessment question.

- `POST /analysis`  
  Compute code/telemetry analysis response.

- `POST /generate-report`  
  Build deep cognitive profile and upsert into `reports`.

- `POST /generate-recommendations`  
  Build AI feedback + study plan + topics/questions and upsert into `recommendations`.

- `POST /submit-code`  
  Persist final submission metadata.

- `GET /user-report/:test_id`  
  Fetch latest report/recommendation for test.

- Recruiter routes:
  - `GET /recruiter-dashboard`
  - `GET /recruiter-report/:reportId`
  - `GET /recruiter-analysis`

## Database Entities (High Level)

- `users`
- `skill_tests`
- `keystroke_logs`
- `submissions`
- `reports`
- `recommendations`
- `emotion_logs`

See `frontend/supabase_schema.sql` and `keystroke_logs_migration.sql` for schema details.

## Environment Variables

Backend (`backend/.env`):
- `PORT` (default: `3001`)
- `JUDGE0_URL`
- `JUDGE0_TOKEN` (optional)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BYTEZ_API_KEY`
- `BYTEZ_MODEL`

Frontend (`frontend/.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_REDIRECT_TO`
- `VITE_CODE_RUNNER_URL` (usually `http://localhost:3001`)
- `VITE_AI_API_BASE` (optional)

## Local Development

From project root:

```bash
npm install
npm run dev
```

Or run services separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Backend default:
- `http://localhost:3001`

Frontend default:
- `http://localhost:8080`

## Testing & Utilities

Frontend:
```bash
cd frontend
npm run test
npm run lint
npm run verify:supabase
```

Backend:
```bash
cd backend
npm run dev
```

## Report Accuracy Notes

- Assessment duration is derived from telemetry timestamps in `keystroke_logs`.
- Typing speed is derived from keystroke counters with sample-speed fallback.
- The AI behavioral story on result page is built from these computed metrics so users see realistic attempt count, duration, and typing speed.

## Additional Docs

- `KEYSTROKE_IMPLEMENTATION_GUIDE.md`
- `KEYSTROKE_SYSTEM_SUMMARY.md`
- `KEYSTROKE_TESTING_GUIDE.md`
- `BEHAVIORAL_TRACKING_IMPLEMENTATION.md`
- `AI_INSIGHTS_FIX.md`

