# The Invitation Studio

Next.js app for event stationery design with Etsy checkout handoff, access-code redemption, admin tools, and print/PDF flows.

## Deploy on Railway

This repo is now Railway-ready with `railway.json`:

- Build: `npm ci && npm run build`
- Start: `npm run start -- -H 0.0.0.0 -p $PORT`
- Health check: `/api/health`

### 1) Create Railway project

1. Create a new project in Railway.
2. Connect this GitHub repository.
3. Deploy the target branch.

### 2) Configure environment variables

Copy values from `.env.railway.example` into Railway Variables.

Minimum variables to run core app/auth flows:

- `NEXT_PUBLIC_APP_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Feature-specific variables:

- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, webhook secrets
- Etsy links: `NEXT_PUBLIC_ETSY_SHOP_URL`, optional route overrides
- Email: `RESEND_API_KEY`
- AI wording: `ANTHROPIC_API_KEY`
- Storage: `R2_*`
- Print fulfillment: `PRODIGI_BASE_URL`, `PRODIGI_API_KEY`

### 3) Set the app URL

After first Railway deploy, set:

- `NEXT_PUBLIC_APP_URL=https://<your-railway-domain>`

Then redeploy so metadata/emails/redirect URLs use the correct domain.

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:3000.
