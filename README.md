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
- Search experience with filters, AI query rewrite toggle, and opportunity cards.
- Opportunity detail with AI summary refresh, metadata, and quick actions.
- Saved items, pipeline, alerts, and proposal generator pages for capture teams.
- AI abstraction layer (`lib/ai.ts`) with endpoints for summaries, proposals, and query rewrite.

## Notes
- When Prisma or external APIs are unavailable, endpoints gracefully fall back to mock data where possible.
- Replace mock data and prompts with production integrations as needed.
