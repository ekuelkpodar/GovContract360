# GovContract360

GovContract360 is a Next.js + TypeScript prototype for an AI-powered government contract search and proposal assistant. It includes marketing pages, authentication, a searchable opportunity catalog, saved searches and alerts, AI-assisted summaries, and a lightweight proposal generator.

## Tech stack
- Next.js (Pages Router) with TypeScript
- Tailwind CSS for styling
- Prisma ORM targeting PostgreSQL
- JWT auth stored in httpOnly cookies
- API routes under `pages/api/*`

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Set environment variables in `.env`
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/govcontract360"
   JWT_SECRET="change-me"
   OPENAI_API_KEY="optional-if-calling-openai"
   OPENAI_MODEL="gpt-4o-mini"
   ```
3. Run database migrations and seed sample data
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. Start the dev server
   ```bash
   npm run dev
   ```

## Key folders
- `pages/` – marketing pages, auth, search, saved items, pipeline, alerts, and proposal flows.
- `pages/api/` – auth, search, AI helpers, saved searches, proposals, and alerts endpoints.
- `lib/` – Prisma client, auth helpers, and AI abstraction.
- `prisma/schema.prisma` – database schema for users, opportunities, saved searches, alerts, proposals, and attachments.
- `prisma/seed.ts` – seeds users and ~40 mock opportunities for testing.

## Feature highlights
- Marketing pages: landing, solutions, pricing, wall of love, tools.
- Auth flows: signup/login/logout issuing JWT cookies.
- Search experience with filters, quick filters, saved search modal, AI query rewrite toggle, pagination, and opportunity cards.
- Opportunity detail with AI summary refresh, bid/no-bid assistant scores, metadata, and quick actions.
- Saved items, pipeline, alerts, onboarding, dashboard, tasks, and proposal generator pages for capture teams.
- AI abstraction layer (`lib/ai.ts`) with endpoints for summaries, proposals, query rewrite, and bid decision guidance.

## Folder structure
- `components/` shared UI including layout and marketing pieces
- `pages/` marketing, auth, onboarding, dashboard, search, tasks, and proposal views
- `pages/api/` auth, onboarding, tasks, notifications, alerts, AI helpers, proposals, and search endpoints
- `lib/` prisma client, auth helpers, scoring, AI abstraction, and logger
- `prisma/` schema and seed data
- `__tests__/` Jest unit and API smoke tests

## Advanced workflows and integrations
- Imports: upload CSVs at `/imports/opportunities` to build `ImportBatch` audit trails and review errors at `/imports/[batchId]`.
- Power search: faceted counts, saved views (`/api/saved-views`), and power query parsing (`lib/search/queryParser.ts`) to mirror analyst workflows.
- AI insights: comparison (`/compare` + `/api/ai/compare-opportunities`), capability gap analysis (`/api/ai/gap-analysis`), and auto pursuit tasks (`/api/ai/generate-opportunity-tasks`).
- Inbox & calendar stubs: RFP email capture via `EmailStub` surfaced on `/inbox`; calendar deadlines via `CalendarEventStub` at `/calendar`.
- Pipeline analytics: `/analytics/pipeline` backed by `lib/analytics/pipeline.ts` and `OpportunityStatusEvent` history.

## Notes
- When Prisma or external APIs are unavailable, endpoints gracefully fall back to mock data where possible.
- Replace mock data and prompts with production integrations as needed.
- Demo users: `founder@example.com` / `password123` after running seed.
