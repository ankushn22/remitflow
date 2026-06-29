# RemitFlow

**Instant UAE → Global remittances with USDC settlement on Arc**

RemitFlow is a hackathon submission for the [Stablecoin Commerce Stack Challenge](https://arc.io) — **Track 1: Best Cross-Border Payments & Remittances Experience (UAE → Global)**.

Pay in AED, settle in USDC on Arc with sub-second confirmation. Built with Circle Wallets, Gateway, CCTP/Bridge Kit, and Arc testnet.

> **For educational and testnet demo purposes only.**

## Hackathon Submission

| Field | Value |
|-------|-------|
| **Title** | RemitFlow — Instant UAE Remittances on Arc |
| **Track** | Cross-Border Payments & Remittances (UAE → Global) |
| **Circle Products** | USDC, Wallets, Gateway, CCTP/Bridge Kit |
| **Architecture** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |

## Features

- **UAE remittance corridors** — India, Pakistan, Philippines, Bangladesh, Egypt, Nepal
- **Pay in AED, settle in USDC** — familiar sender UX with transparent fee breakdown
- **Circle Gateway routing** — unified USDC balance for treasury payouts
- **CCTP / Bridge Kit** — cross-chain USDC movement to Arc
- **Sub-second settlement** — Arc deterministic finality with live settlement tracker
- **Compliance screening** — recipient address screening before send
- **Remittance receipts** — on-chain confirmation + in-app receipt

## Prerequisites

- **Node.js v22+**
- **Supabase** — [local Docker](https://supabase.com/docs/guides/cli) or [cloud project](https://supabase.com/)
- **Circle Developer Account** — [console.circle.com](https://console.circle.com/signup)
  - API key
  - [Entity Secret](https://developers.circle.com/wallets/dev-controlled/register-entity-secret)

## Quick Start

```bash
git clone <your-repo-url>
cd remitflow
npm install
cp .env.example .env.local
# Fill in Supabase + Circle credentials in .env.local
```

### Database setup

**Local Supabase (Docker):**
```bash
npx supabase start
npx supabase migration up
```

**Remote Supabase:**
```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Sign up → **Send Money**.

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Circle
CIRCLE_API_KEY=
CIRCLE_ENTITY_SECRET=
```

## Circle Integration Guide

### 1. Circle Wallets (Developer-Controlled)

- Wallets created via `/api/wallet` on first login
- Used for sender treasury and recipient Arc addresses
- Docs: [developers.circle.com/wallets/dev-controlled](https://developers.circle.com/wallets/dev-controlled)

### 2. Circle Gateway

- Unified USDC balance aggregated across chains
- Remittance payouts sourced from Gateway via `/api/payout`
- Docs: [developers.circle.com/gateway](https://developers.circle.com/gateway)

### 3. CCTP / Bridge Kit

- Cross-chain USDC transfers when source liquidity is not on Arc
- Integrated in payout routing and rebalance flows
- Docs: [developers.circle.com/cctp](https://developers.circle.com/cctp)

### 4. Arc Testnet

- Chain ID: `5042002`
- USDC as gas token — predictable dollar-denominated fees
- Docs: [docs.arc.io](https://docs.arc.io/)

## Project Structure

```
remitflow/
├── app/
│   ├── dashboard/send-money/   # Main remittance flow
│   └── api/                    # Circle + Supabase APIs
├── components/
│   ├── remittance-send-form.tsx
│   ├── fee-breakdown.tsx
│   └── settlement-tracker.tsx
├── lib/constants/
│   └── remittance-corridors.ts # UAE → Global corridors
└── docs/
    └── ARCHITECTURE.md         # Submission architecture diagram
```

## Demo Script (Video)

1. Show problem: UAE expat remittances cost 5–7% and take days
2. Open RemitFlow → select UAE → India corridor
3. Enter 500 AED → show transparent fee breakdown
4. Enter recipient name + Arc wallet address
5. Send → watch real-time settlement tracker
6. Show receipt with sub-second Arc confirmation
7. Highlight Circle products: Wallets, Gateway, CCTP, Arc USDC

## Circle Product Feedback

### Why we chose these products

- **Circle Wallets** — UAE senders and global recipients need embedded wallets without seed phrases or crypto jargon.
- **Circle Gateway** — Remittances require routing unified USDC liquidity across chains; Gateway eliminates manual per-chain treasury management.
- **CCTP / Bridge Kit** — Many senders hold USDC on Ethereum/Base; CCTP provides native burn-and-mint cross-chain movement to Arc settlement.
- **USDC on Arc** — Predictable gas fees and sub-second finality are essential for remittance UX where cost certainty and instant confirmation matter.

### What worked well

- Arc-fintech starter provided working Gateway + Bridge Kit + Wallets integration out of the box.
- Gateway unified balance simplified payout source selection for cross-chain remittances.
- Arc testnet finality is genuinely fast — excellent for demoing "instant remittance" narrative.
- Developer-controlled wallets API is well-documented for server-side payout flows.

### What could be improved

- Testnet faucet / funding flow could be more discoverable for hackathon participants.
- Bridge Kit error messages could surface more actionable recovery steps when cross-chain liquidity is insufficient.
- StableFX integration docs would help build stronger "Pay in AED" production flows (we used conceptual AED UX for demo).
- A dedicated remittance/quickstart template in Arc docs would accelerate UAE corridor projects.

### Recommendations

- Publish an official "Remittance on Arc" quickstart combining Wallets + Gateway + CCTP in one tutorial.
- Add corridor-specific fee estimation helpers to Gateway SDK.
- Provide a hackathon-ready testnet USDC faucet linked from Arc House event pages.
- Consider a Nanopayments example for micro-remittance corridors in future docs.

## License

Apache-2.0 — based on [circlefin/arc-fintech](https://github.com/circlefin/arc-fintech).