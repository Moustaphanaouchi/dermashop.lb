# Dermashop LB — Luxury Clinical Landing Page

High-end, mobile-first e-commerce landing page for **Dermashop LB** with:
- Categorized product grid (Skin / Hair / Tools)
- Slide-out shopping cart with totals in **USD**
- WhatsApp checkout to **+9613448482** (prefilled message with line breaks)
- **Wish Money** payment notice
- Simple **Admin** area to update **price + stock** (persisted in browser storage)

## Prerequisites
- Node.js 20+ recommended

## Install & Run

```bash
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:3000`.

## Build for production (optional)

```bash
corepack pnpm build
corepack pnpm start
```

## Admin Access
- Visit `/admin`
- Default passcode: `DERMASHOP`
- Change it via env var: `NEXT_PUBLIC_ADMIN_PASSCODE`

Create a `.env.local`:

```bash
NEXT_PUBLIC_ADMIN_PASSCODE=DERMASHOP
```

