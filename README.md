# Surround Auto Booking Setup

This version has a real booking server behind the page.

## What it does

- Mechanical repair requests route to `info@surroundauto.co.nz`.
- Panel and paint requests route to `Panel@surroundauto.co.nz`.
- Shop items are loaded from `products.json`.
- Shop payments go to Stripe as flexible `$1 NZD` units, so `50` quantity can represent `NZ$50`.
- Bookings are saved locally in `data/bookings.jsonl`.
- Email sending is ready through Resend once `RESEND_API_KEY` and `FROM_EMAIL` are configured.
- Stripe Checkout is ready once `STRIPE_SECRET_KEY` is configured.

## Local preview

To test configuration locally, copy `.env.example` to `.env` and fill the values you want to test.

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

## Adding new shop items

Edit [products.json](C:\Users\80 Motors Hornby #05\Documents\Codex\2026-06-29\nin\outputs\surroundauto\products.json) and add a new object with:

- `id`
- `name` and `nameZh`
- `description` and `descriptionZh`
- `category`
- `priceLabel`
- `note`
- `unitAmountCents`
- `defaultQuantity`
- `minQuantity`

## Production environment values

Copy `.env.example` into your hosting provider's environment settings. Do not publish real secret keys in the browser or in the code.

Required for real email:

```text
RESEND_API_KEY=...
FROM_EMAIL=bookings@surroundauto.co.nz
```

Required for payment:

```text
STRIPE_SECRET_KEY=sk_live_...
BOOKING_CURRENCY=nzd
SITE_BASE_URL=https://your-domain.co.nz
STRIPE_WEBHOOK_SECRET=whsec_...
```
