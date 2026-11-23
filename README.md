# Tickwise web

The website, dashboard and API for [Tickwise](https://tickwise.ashutoshswamy.in): sponsor lines in the Claude Code spinner. Developers earn 70% of each impression, advertisers pay per 1,000 impressions by card.

The VS Code extension lives in [tickwise-extension](https://github.com/ashutoshswamy/tickwise-extension).

## Stack

Next.js 16 (App Router), Tailwind v4, smoui components, Firebase Auth (email/password and Google), Neon Postgres, Dodo Payments.

## Run locally

```
cp .env.example .env.local   # fill in the values below
npm install
npm run migrate              # creates the tables in Neon
npm run dev                  # http://localhost:3000
```

Firebase: enable Email/Password and Google under Authentication, and add your domain under Authorized domains.

## Environment

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_*` | Firebase web config and Admin service account |
| `APP_URL`, `NEXT_PUBLIC_SITE_URL` | Public site URL, used for checkout returns, canonical links and the sitemap |
| `DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_WEBHOOK_KEY`, `DODO_PRODUCT_ID`, `DODO_ENV` | Dodo Payments. One pay-what-you-want product, minimum $5. Webhook: `/api/dodo`, event `payment.succeeded` |
| `ADMIN_EMAILS` | Comma-separated emails allowed into `/admin`. The email must also be verified |
| `PAYOUT_KEY` | 64 hex characters (`openssl rand -hex 32`). Encrypts developers' bank details. Losing it makes them unreadable |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the legal pages |

Never commit `.env.local`.

## How it works

- The extension writes ads into Claude Code's `spinnerVerbs` and reports impressions to `/api/impression`. One impression at CPM `c` costs `c` micro-cents. The developer keeps 70%.
- Advertisers create a campaign, pay through Dodo, and the webhook flips it to `active`. Ads need a link and a placement (terminal, extension or both).
- Developers request payouts from $10. Payouts are recorded and paid by hand; admins mark them paid in `/admin/payouts`.
- `/admin` is limited to `ADMIN_EMAILS`. It has revenue, payouts, campaign moderation and users.

## Layout

- `app/` pages and API routes (`api/ads`, `api/impression`, `api/dodo`, `api/stream`, `api/session`)
- `components/` UI pieces and the shared logo
- `lib/` auth, db, Dodo, vault (bank-detail encryption), stats
- `db/schema.sql` the schema; `scripts/migrate.mjs` applies it

## Deploy

Import the repo in Vercel, set the environment above, attach the domain, and add it to Firebase Authorized domains. Switch `DODO_ENV` to `live_mode` with live keys for real payments.

Tickwise is an independent service and is not affiliated with Anthropic.
