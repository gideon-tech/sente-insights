# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (Next.js 16, port 3000)
- `npm run build` — production build
- `npm run start` — serve production build
- No test runner or linter is configured.

## Architecture

Sente Insights is a Next.js 16 App Router application that converts bank/mobile money statements (PDF) into structured data and provides AI-powered financial insights, targeting East African users (UGX, KES, TZS, RWF currencies).

### Core Flow

1. User uploads a bank statement PDF via `/convert`
2. `app/api/convert/route.ts` sends it to the BSC (Bank Statement Converter) external API (`lib/bsc.ts`) which parses the PDF into normalized transactions
3. Premium users can request AI insights via `app/api/insights/route.ts`, which calls Claude (`lib/claude.ts`) to analyze transactions
4. Results are stored in Supabase and shown on the dashboard

### Key Integrations

- **BSC API** (`lib/bsc.ts`) — external service for PDF-to-transaction parsing. Upload -> poll status -> convert flow. Env vars: `BSC_API_URL`, `BSC_API_KEY`
- **Supabase** (`lib/supabase/`) — auth and database. `server.ts` uses service role key (bypasses RLS), `client.ts` uses anon key for browser. Tables: `profiles`, `daily_usage`, `conversions`, `insights`, `subscriptions`
- **Claude API** (`lib/claude.ts`) — financial analysis of parsed transactions. Uses `claude-sonnet-4-20250514`
- **PesaPal** (`lib/pesapal.ts`) — payment gateway for subscriptions. Webhook at `app/api/webhooks/pesapal/route.ts`

### Tier System

Defined in `lib/tiers.ts`. Four tiers: `anonymous` (2/day, no auth), `free` (5/day), `premium` (unlimited + insights), `enterprise` (unlimited + insights). Auth determines tier; anonymous users get a session-based ID.

### Path Aliases

`@/*` maps to project root (e.g., `@/lib/utils`, `@/types`).

### Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `BSC_API_URL`, `BSC_API_KEY`, `ANTHROPIC_API_KEY`, `PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET`, `PESAPAL_API_URL`

### Deployment

Deployed on Vercel. `vercel.json` configures extended function durations (120s for convert, 60s for insights) and a daily cron at 2 AM for subscription expiry checks.
