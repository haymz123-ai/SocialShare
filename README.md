
## 🔧 Stripe + Supabase + Clerk — Billing Setup Guide

---

### 1. Create Your Stripe Account

1. Go to https://stripe.com and click Sign Up
2. Verify your email address
3. Complete your business profile (required for live payouts)
4. Enable Test Mode using the toggle in the top-right of the dashboard

---

### 2. Create Products & Get Price IDs

You need two products: Growth and Scale.

For each plan:

1. Go to Product Catalog in the left sidebar
2. Click + Add product
3. Set the name (e.g., Growth Plan), choose Recurring, set your price and billing period to Monthly
4. Click Save product
5. On the product detail page, scroll to Pricing and copy the Price ID on the right, it looks like:

   price_1OtXxxXXXXXXXXXXXXXXXXXX

Repeat for the Scale plan. These become:

   NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID=price_1Oxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID=price_1Oxxxxxxxxxxxxxxxx

---

### 3. Get Your Stripe API Keys

1. Go to Developers → API Keys in the Stripe Dashboard
2. Copy the Secret Key (starts with sk_test_) and the Publisher Key — this is your NEXT_PUBLIC_STRIPE_SECRET_KEY

NOTE: Despite the variable name containing NEXT_PUBLIC_, this key must only be used
in server-side route handlers (/api/). Never expose it on the client.

---

### 4. Create the Stripe Webhook

1. Go to Developers → Webhooks in the Stripe Dashboard
2. Click + Add endpoint
3. Set the Endpoint URL to:

   https://yourdomain.com/api/stripe/webhook

4. Under Select events, add all four of the following:

   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed

5. Click Add endpoint
6. Open the webhook you just created, scroll to Signing secret, click Reveal,
   and copy the value (starts with whsec_)

This becomes your NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET.

Testing locally with the Stripe CLI:

   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook

The CLI will print a local whsec_... secret — use that as your webhook secret in .env.local.

---

### 5. Supabase Setup

Create the required users table by running this in your Supabase SQL Editor (Dashboard → SQL Editor):

   create table if not exists public.users (
     id uuid primary key default gen_random_uuid(),
     clerk_user_id text unique not null,
     stripe_customer_id text,
     stripe_subscription_id text,
     plan text default 'free',
     plan_status text default 'inactive',
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

Get your Supabase keys:

1. Go to Settings → API in your Supabase project
2. Copy the Project URL                → NEXT_PUBLIC_SUPABASE_URL
3. Copy the anon public key            → NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Copy the service_role key if needed → keep this server-only

---

### 6. Clerk Setup

1. Open your app in the Clerk Dashboard (https://clerk.com)
2. Go to API Keys
3. Copy the Publishable Key (starts with pk_test_) → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
4. Copy the Secret Key (starts with sk_test_)      → CLERK_SECRET_KEY

---

### 7. Environment Variables

Create a .env.local file in the root of your project:

   # Stripe
   NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID=price_1Oxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID=price_1Oxxxxxxxxxxxxxxxx

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxxxxxxxxxxxxxxx

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000

NOTE: Never commit .env.local to Git. Add it to your .gitignore.

---

### 8. Going Live (Production)

Before launching, switch everything to Live Mode:

1. Toggle Test Mode OFF in the Stripe Dashboard
2. Re-create your Products and Prices in Live Mode — you will get new price_ IDs
3. Copy your live Secret Key (sk_live_...) from Developers → API Keys
4. Create a new Webhook endpoint pointing to your production URL in Live Mode,
   subscribe to the same 4 events, and copy the new Signing Secret (whsec_...)
5. Update all environment variables on your hosting platform (Vercel, Railway, etc.)
   with the live values

Test card for end-to-end testing in Test Mode:
   Card number : 4242 4242 4242 4242
   Expiry      : Any future date
   CVC         : Any 3 digits

---

### Setup Checklist

   [ ] Stripe account created and email verified
   [ ] Growth plan product created and Price ID copied
   [ ] Scale plan product created and Price ID copied
   [ ] Stripe Secret Key copied (sk_test_...)
   [ ] Webhook endpoint created with all 4 events
   [ ] Webhook Signing Secret copied (whsec_...)
   [ ] Supabase users table created
   [ ] Supabase URL and anon key added to env vars
   [ ] Clerk Publishable Key and Secret Key added to env vars
   [ ] End-to-end checkout tested with Stripe test card
