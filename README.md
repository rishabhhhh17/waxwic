# waxwic

Solid perfumes, hand-poured. A production-ready Next.js 14 D2C site with Razorpay checkout, Meta Pixel + CAPI, and a lightweight admin dashboard backed by Razorpay (no database).

## What's inside

- **Next.js 14 App Router**, TypeScript, Tailwind, Inter + Cormorant Garamond
- **Razorpay** order create + signature-verified webhook (the source of truth for orders)
- **Meta Pixel + Conversions API** with `event_id` deduplication
- **Cart**: `zustand` + localStorage persist, side-drawer UX
- **Admin dashboard** at `/admin` reading live from `razorpay.payments.all`
- **No database.** Catalogue is `lib/products.ts`; orders live in your Razorpay account.

## Local dev

```bash
cp .env.local.example .env.local        # fill the values below
npm install
npm run dev                             # http://localhost:3000
```

Generate `ADMIN_SESSION_SECRET`:

```bash
openssl rand -hex 32
```

## Environment variables

| Var | What |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://waxwic.in` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | server keys |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | client key |
| `RAZORPAY_WEBHOOK_SECRET` | the secret you enter when creating the webhook in Razorpay |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `META_ACCESS_TOKEN` | Conversions API token |
| `META_TEST_EVENT_CODE` | optional, only while validating CAPI |
| `ADMIN_PASSWORD` | admin login password |
| `ADMIN_SESSION_SECRET` | 32+ random chars (see above) |

## Routes

| Path | Notes |
|---|---|
| `/` | Homepage |
| `/products` | Filterable grid |
| `/products/[slug]` | PDP — six prerendered |
| `/checkout` | Razorpay modal |
| `/order-confirmation/[orderId]` | Thank-you page; fires browser `Purchase` |
| `/admin` | Login-gated, lists payments from Razorpay |
| `/about` `/contact` `/wholesale` `/shipping` `/privacy` `/terms` | Static pages |
| `/api/products` `/api/products/[slug]` | Static, revalidate hourly |
| `/api/orders` | Server-prices the cart, calls `razorpay.orders.create` |
| `/api/orders/verify` | HMAC-verify signature, fires browser-side CAPI |
| `/api/webhook/razorpay` | Verifies raw-body HMAC, fires server CAPI |
| `/api/admin/auth` | POST to log in, DELETE to log out |
| `/api/admin/payments` | Auth-gated, returns `razorpay.payments.all` |

## Source of truth

- **Catalogue** lives in `lib/products.ts`. Edits are git commits, no seed step.
- **Orders** live in your Razorpay account. Customer name, email, line items, and the Meta `event_id` are stashed in the order's `notes` field so the webhook and the admin dashboard can reconstruct everything.
- **There is no database.** Stock counts in `lib/products.ts` are display-only.

## Deploy to Vercel

1. Push to GitHub: `git init -b main && git add -A && git commit -m "init" && gh repo create waxwic --public --source=. --remote=origin --push`
2. Click https://vercel.com/new and import the repo.
3. Paste each var from `.env.local.example` into Production + Preview.
4. After first deploy, Domains → add `waxwic.in` (or your domain).
5. In Razorpay, register the webhook at `https://<your-domain>/api/webhook/razorpay` and subscribe to `payment.captured` and `order.paid`. Use the same secret you put in `RAZORPAY_WEBHOOK_SECRET`.
6. In Meta Events Manager, validate Pixel + CAPI dedup on `<your-domain>/order-confirmation/*` while `META_TEST_EVENT_CODE` is set, then remove it.

## Pixel events

| Event | Where | Notes |
|---|---|---|
| `PageView` | Every page (root layout) | |
| `ViewContent` | PDP mount, `useRef`-guarded | content_id + value |
| `AddToCart` | Quick-add and PDP "Add to cart" | contents + value |
| `InitiateCheckout` | `/checkout` mount | full cart payload |
| `Purchase` | `/order-confirmation/[orderId]` mount, `useRef`-guarded | uses the same `event_id` the webhook CAPI sends, for Meta dedup |

## Photography

Product photos in `public/images/` are stock photography sourced from Unsplash for the launch. Replace each with your own studio shots before paid traffic.

## What's not built

- Email/SMS receipts. The thank-you page tells the customer to save the page; nothing is auto-sent.
- Inventory write-back. Stock counts in `lib/products.ts` are display copy; Razorpay tells you what sold.
- Fulfilment status. Use Razorpay + your courier dashboard until you wire a CMS or DB.

## Smoke test

```bash
npx next build
(npx next start -p 3939 &) && sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3939/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3939/products/kashmir
curl -s -o /dev/null -w "%{http_code}\n" --max-redirs 0 http://localhost:3939/admin   # 307 (redirects to /admin/login)
pkill -f "next start"
```
