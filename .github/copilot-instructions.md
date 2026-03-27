# Copilot Instructions for Sente Insights

## Project Overview

**Sente Insights** is a fintech platform for East Africa that converts bank statements and mobile money transactions into structured data, with AI-powered financial insights. Target users: 5,000+ businesses automating financial workflows across Uganda, Kenya, Tanzania, and Rwanda.

### Core Features
- Bank statement conversion (PDF/image/CSV → JSON/CSV/Excel) via BankStatementConverters.ai
- AI-powered transaction categorization and spending insights using Claude Sonnet 4
- Subscription management with Pesapal payment gateway
- Tier-based usage limits (anonymous, free, premium, enterprise)

---

## Build, Dev, and Deploy

### Commands
```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Production server
npm start
```

**No linting or test commands are configured.** Do not add linters/tests unless requested.

---

## Architecture

### Tech Stack
- **Next.js 16.2.1** (App Router) - ⚠️ **See Next.js warning below**
- **React 19.2.4** with Server Components
- **TypeScript** with strict mode
- **Tailwind CSS 4** (PostCSS config)
- **Supabase** for auth and database
- **Anthropic Claude** for AI insights
- **BankStatementConverters.ai** for PDF/OCR processing
- **Pesapal** for payment processing

### Key File Structure
```
app/
├── (routes)/              # Pages: /, /convert, /dashboard, /login, /pricing, etc.
├── api/
│   ├── convert/          # Upload & convert bank statements
│   ├── insights/         # Claude AI analysis (Premium only)
│   ├── subscribe/        # Initiate Pesapal payment
│   ├── subscription/     # Get user subscription status
│   ├── usage/            # Check daily conversion quota
│   ├── history/          # Past conversions
│   ├── me/               # User profile
│   ├── webhooks/pesapal/ # Payment completion callbacks
│   └── cron/             # Subscription expiry job
lib/
├── supabase/             # Client (browser) & Server (admin) instances
├── claude.ts             # AI transaction analysis
├── bsc.ts                # BankStatementConverter API client
├── pesapal.ts            # Payment gateway integration
├── tiers.ts              # Tier limits & feature gating
└── utils.ts              # Formatting & helpers
components/
├── landing/              # Landing page sections
├── layout/               # Navbar, Footer
└── ui/                   # Reusable primitives (Button, Card, Input, Badge)
types/index.ts            # All TypeScript types
```

---

## ⚠️ Next.js Version Warning

**This project uses Next.js 16.2.1, which has breaking changes from earlier versions.**

Before writing Next.js code:
1. Check `node_modules/next/dist/docs/` for current API documentation
2. Heed all deprecation warnings
3. Do NOT rely on training data for Next.js conventions

---

## Authentication & Authorization

### Dual Identity Pattern
- **Logged-in users**: Supabase JWT via `Authorization: Bearer <token>` header
- **Anonymous users**: `sente_session` cookie (generated UUID stored in browser)

### Auth Checks in API Routes
```typescript
// Extract user from JWT
const supabase = createServerClient();
const { data: { user } } = await supabase.auth.getUser();

// Fall back to session cookie for anonymous users
if (!user) {
  const sessionId = cookies().get('sente_session')?.value;
}
```

### Feature Gating
- **Convert endpoint** (`/api/convert`): Optional auth (supports both logged-in & anonymous)
- **Insights endpoint** (`/api/insights`): Auth required + Premium/Enterprise tier only
- **History, subscription, me endpoints**: Auth required

Always check tier before granting access to premium features using `lib/tiers.ts` helpers.

---

## Tier Configuration

Defined in `lib/tiers.ts`:

| Tier | Daily Limit | Formats | Insights | History |
|------|-------------|---------|----------|---------|
| anonymous | 2 | CSV, JSON | ❌ | ❌ |
| free | 5 | CSV, JSON, Excel | ❌ | ✅ |
| premium | ∞ | CSV, JSON, Excel | ✅ | ✅ |
| enterprise | ∞ | CSV, JSON, Excel | ✅ | ✅ |

### Usage Pattern
```typescript
import { getTierConfig, hasReachedLimit, canUseFormat } from '@/lib/tiers';

const config = getTierConfig(userTier);
if (hasReachedLimit(userTier, dailyUsed)) {
  return Response.json({ error: 'Daily limit reached' }, { status: 429 });
}
```

---

## BankStatementConverter Integration

### Multi-Step Workflow
1. **Upload** → Get UUID
2. **Set Password** (if PDF encrypted)
3. **Wait for Processing** (poll status every 10s, max 2 min)
4. **Convert** → Extract transactions

### Pattern in `/api/convert`
```typescript
import { uploadStatement, setPassword, waitUntilReady, convertStatement } from '@/lib/bsc';

const uploads = await uploadStatement(fileBuffer, filename);
const { uuid, pdfType, state } = uploads[0];

if (password) await setPassword(uuid, password);
if (pdfType === 'IMAGE_BASED' || state === 'PROCESSING') {
  await waitUntilReady(uuid); // Polls until READY
}

const result = await convertStatement(uuid, format);
```

**Important**: Always handle timeouts and BSC errors gracefully; log to user-facing error messages.

---

## Claude AI Insights

### Endpoint: `/api/insights`
- **Auth**: Required
- **Tier**: Premium/Enterprise only
- **Input**: Array of `Transaction` objects
- **Output**: `InsightsResponse` with spending breakdown, monthly summary, habit insights

### East African Context
```typescript
// From lib/claude.ts
const categories = [
  'Airtime & Data',
  'Transport',        // Boda, matatu, SafeBoda
  'Food & Market',
  'Bills & Utilities', // UMEME, NWSC, Yaka
  'Transfers',        // M-Pesa, Mobile Money
  'Savings',
  'Loans',
  'Fees',
  'Entertainment',
  'Other'
];

const currencies = ['UGX', 'KES', 'TZS', 'RWF'];
```

**Pattern**: Claude returns raw JSON (sometimes with markdown fences). Always strip `\`\`\`json` wrappers before parsing.

---

## Pesapal Payment Integration

### Subscription Flow
1. User calls `/api/subscribe` with `{ phone, countryCode, plan }`
2. Create pending `subscriptions` record in Supabase
3. Call `pesapal.submitOrder()` → Get redirect URL
4. User completes payment on Pesapal
5. Pesapal webhook (`/api/webhooks/pesapal`) triggers on completion
6. Webhook updates: subscription status → `'active'`, user tier → `'premium'`, `expires_at` = now + 30 days
7. Cron job (`/api/cron/check-subscriptions`) expires old subscriptions

### Token Caching
`lib/pesapal.ts` caches OAuth tokens to avoid re-authenticating on every request. Always refresh before expiry.

---

## Database Schema (Supabase)

### Tables
- **profiles**: `id`, `email`, `full_name`, `tier`, `created_at`, `updated_at`
- **conversions**: `id`, `user_id`, `filename`, `file_type`, `output_format`, `page_count`, `transaction_count`, `status`, `bsc_uuid`, `error_message`, `created_at`
- **insights**: `id`, `conversion_id`, `user_id`, `spending_breakdown`, `monthly_summary`, `habit_insights`, `period_covered`, `created_at`
- **subscriptions**: `id`, `user_id`, `plan`, `status`, `pesapal_order_tracking_id`, `amount`, `currency`, `started_at`, `expires_at`, `cancelled_at`, `created_at`
- **daily_usage**: `id`, `user_id`, `session_id`, `date`, `conversions_used`

### Client vs Server
- **`lib/supabase/client.ts`**: Browser-side queries (anon key)
- **`lib/supabase/server.ts`**: Server-side admin operations (service key)

Always use `createServerClient()` in API routes to avoid exposing service key to browser.

---

## UI/UX Conventions

### Neobrutalist Design
- **Bold borders**: `border-[3px]`, `border-brutal-black`
- **Neon colors**: `brutal-yellow`, `brutal-cyan`, `brutal-pink`, `brutal-green`
- **Custom shadows**: `neo-shadow` class (defined in `globals.css`)
- **Typography**: Space Mono (headers), Inter (body)

### Tailwind Custom Colors
```css
/* globals.css */
--brutal-yellow: #FFD700;
--brutal-cyan: #00FFFF;
--brutal-pink: #FF1493;
--brutal-green: #00FF00;
--brutal-black: #000000;
--brutal-bg: #F5F5F5;
--brutal-card: #FFFFFF;
--brutal-muted: #6B7280;
```

### Responsive Breakpoints
- Mobile-first approach
- Use `sm:` (640px), `md:` (768px), `lg:` (1024px) for responsive design
- Navbar collapses to hamburger menu below `md:`

---

## Environment Variables

### Required for Development
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# BankStatementConverters.ai
BSC_API_KEY=bsc_live_xxxx
BSC_API_URL=https://api2.bankstatementconverter.com/api/v1

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Pesapal
PESAPAL_CONSUMER_KEY=xxxxx
PESAPAL_CONSUMER_SECRET=xxxxx
PESAPAL_API_URL=https://cybqa.pesapal.com/pesapalv3

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Copy `.env.example` to `.env.local` before starting development.

---

## Key Conventions

### Error Handling
```typescript
// Consistent API response format
return Response.json({ error: 'User-friendly message' }, { status: 400 });
return Response.json({ data: result }, { status: 200 });
```

Always catch errors and return helpful messages without exposing internal API details.

### Currency Formatting
```typescript
import { formatCurrency } from '@/lib/utils';

formatCurrency(45000, 'UGX'); // "UGX 45,000"
```

Default to East African currencies. Use `en-UG` locale for Intl API.

### Transaction Normalization
BSC returns transactions with `debit`, `credit`, `balance` fields. Store as-is; compute `amount` client-side if needed.

### Status Values
- **Conversion**: `'processing'`, `'ready'`, `'completed'`, `'failed'`
- **Subscription**: `'pending'`, `'active'`, `'expired'`, `'cancelled'`

### Session ID Generation
```typescript
import { generateSessionId } from '@/lib/utils';

// For anonymous users
const sessionId = generateSessionId(); // UUID v4
```

Store in `sente_session` cookie with 30-day expiry.

---

## API Response Patterns

### Success
```json
{
  "data": {
    "id": "uuid",
    "filename": "statement.pdf",
    "transactions": [...],
    "transactionCount": 142
  }
}
```

### Error
```json
{
  "error": "Daily conversion limit reached. Upgrade to Premium for unlimited conversions."
}
```

### Status Codes
- `200`: Success
- `400`: Bad request (missing fields, invalid format)
- `401`: Unauthorized (missing auth token)
- `403`: Forbidden (wrong tier, feature not available)
- `429`: Rate limited (daily quota exceeded)
- `500`: Server error (API failure, internal error)

---

## Common Tasks

### Adding a New Tier Feature
1. Update `TIER_CONFIG` in `lib/tiers.ts`
2. Add feature gate in relevant API route
3. Update UI to show/hide based on user tier
4. Test with all 4 tiers (anonymous, free, premium, enterprise)

### Adding a New API Endpoint
1. Create route in `app/api/[name]/route.ts`
2. Import `createServerClient()` for auth checks
3. Validate inputs with type guards
4. Handle errors with try-catch
5. Return consistent JSON response
6. Add types to `types/index.ts` if needed

### Working with Supabase
```typescript
// Server-side (API routes)
import { createServerClient } from '@/lib/supabase/server';
const supabase = createServerClient();

// Client-side (components)
import { createBrowserClient } from '@/lib/supabase/client';
const supabase = createBrowserClient();
```

Never use service key on client side.

---

## Troubleshooting

### BSC Integration Issues
- **Timeout**: Increase `maxAttempts` in `waitUntilReady()` for large files
- **IMAGE_BASED PDFs**: These require OCR; always call `waitUntilReady()`
- **Encrypted PDFs**: Call `setPassword()` before `convertStatement()`

### Authentication Errors
- Check `Authorization` header format: `Bearer <token>`
- Verify token hasn't expired (Supabase tokens expire after 1 hour)
- For anonymous users, ensure `sente_session` cookie exists

### Tier Limit Issues
- Query `daily_usage` table to check current usage
- Ensure date comparison uses UTC
- Reset usage counts at midnight UTC

### Webhook Not Firing
- Verify Pesapal IPN is registered (`pesapal.registerIPN()`)
- Check webhook URL is publicly accessible
- Confirm `PESAPAL_API_URL` matches environment (sandbox vs production)
