# Casper AI Portfolio Agent

> **Autonomous AI portfolio analyst that reads your holdings, thinks, and executes rebalancing actions on Casper Testnet.**
>
> Live: [casper-ai-portfolio-agent.vercel.app](https://casper-ai-portfolio-agent.vercel.app) | Contract: [Testnet Explorer](https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6)

---

## TL;DR for Judges

This is not a mockup. Every analysis triggers a **real Casper 2.0 transaction** signed by the AI agent and recorded on-chain. The agent pays for its own compute via the **x402 micropayment protocol**, talks to you in a conversational interface, and can autonomously execute native CSPR transfers based on its own recommendations.

| | |
|---|---|
| **Live App** | [casper-ai-portfolio-agent.vercel.app](https://casper-ai-portfolio-agent.vercel.app) |
| **Smart Contract** | [`PortfolioAgent` on Casper Testnet](https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6) |
| **On-chain write proof** | [`cc648f7d…1307b779`](https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779) |
| **Contract install txn** | [`9460c0d3…b22a2dc0a`](https://testnet.cspr.live/transaction/9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a) |
| **Package Hash** | `1786b541e2c353accd37cc3c2811a11947e5f4188cdd3da99da011b50795fe50` |
| **License** | MIT |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14, App Router)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │  Hero / UI  │  │ WalletConnect│  │ Agent Chat  │  │  Portfolio View │   │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └────────┬────────┘   │
│         │                │                │                │              │
│         └────────────────┴────────────────┴────────────────┘              │
│                              Zustand State Store                            │
└────────────────────────────────────────┬────────────────────────────────────┘
                                       │
                    ┌──────────────────┬─┴──────────────┐
                    ▼                  ▼                ▼
            ┌───────────┐    ┌──────────────┐   ┌──────────┐
            │ /api/portfolio│   │ /api/analyze  │   │ /api/chat │
            │  (CSPR.cloud)│   │  (OpenAI/Claude│   │ (OpenAI)  │
            └─────┬───────┘    └──────┬───────┘   └─────┬────┘
                  │                   │                  │
                  ▼                   ▼                  ▼
         ┌─────────────────┐  ┌────────────────┐  ┌──────────────┐
         │  CSPR.cloud API │  │  AI Provider   │  │  OpenAI API  │
         │  (balances)     │  │  (GPT-4o /    │  │  (ChatGPT)   │
         │                 │  │   Sonnet)      │  │              │
         └─────────────────┘  └────────┬───────┘  └──────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────────┐
                         │      casper-agent.ts         │
                         │  (server-side agent wallet)  │
                         └────────────┬────────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────────┐
                         │   PortfolioAgent Contract    │
                         │   (Odra / Casper Testnet)    │
                         └─────────────────────────────┘
```

---

## Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS 3.4, Zustand | SSR/SSG, state management, atomic CSS |
| **Fonts** | Inter + IBM Plex Mono | Typography hierarchy |
| **Animation** | CSS keyframes (`transform` + `opacity` only), `prefers-reduced-motion` | GPU-composited motion, WCAG AA accessibility |
| **AI** | OpenAI GPT-4o (primary) / Claude 3.5 Sonnet (fallback) | Portfolio analysis with structured JSON output |
| **Blockchain** | `casper-js-sdk` v5.0.12 | Native Casper 2.0 transaction signing and submission |
| **Contract** | Odra framework, Rust | `PortfolioAgent` smart contract on Casper Testnet |
| **Data** | CSPR.cloud REST API | Live account balances, token prices |
| **Payments** | Casper x402 protocol | Per-request micropayment settlement via facilitator |
| **Deployment** | Vercel | Edge-cached, auto-deployed from Git |

---

## Key Technical Features

### 1. Autonomous On-Chain Agent (`casper-agent.ts`)

The backend maintains its own **agent wallet** (loaded from `CASPER_AGENT_PRIVATE_KEY_PEM`). On every analysis:

1. AI generates a risk profile and recommendations.
2. The agent **hashes the full analysis** with SHA-256.
3. It builds a `ContractCallBuilder` targeting the `store_analysis` entry point.
4. It **signs the transaction** with its private key.
5. It submits the transaction to the Casper Testnet public RPC node.
6. It returns the transaction hash and explorer link to the frontend.

```typescript
// Simplified from src/lib/casper-agent.ts
const tx = new ContractCallBuilder()
  .from(privateKey.publicKey)
  .byPackageHash(packageHash)
  .entryPoint('store_analysis')
  .runtimeArgs(buildArgs())
  .chainName('casper-test')
  .payment(10_000_000_000, 2)
  .build()

tx.sign(privateKey)

const result = await new RpcClient(new HttpHandler(RPC_URL))
  .putTransaction(tx)
```

**Result:** Every analysis produces an immutable, auditable record on Casper Testnet.

### 2. Graceful AI Fallback with Heuristic Analysis

If the OpenAI API is unavailable (no API key, rate limits, downtime), the system attempts Claude fallback; if both fail, it falls back to a **deterministic heuristic** that:

- Computes concentration risk from live portfolio data.
- Assesses stablecoin buffer percentage.
- Generates actionable rebalancing recommendations.
- Is clearly labelled `analysisSource: 'heuristic'` — never confused with AI output.

This ensures the demo is **100% functional offline**.

### 3. x402 Micropayment Protocol Integration

The agent supports **Casper's x402** HTTP-native payment standard:

- **Facilitator mode:** When `X402_FACILITATOR_URL` is set, the agent calls `/verify` and `/settle` endpoints to produce real on-chain micropayments.
- **Demo mode:** Without a facilitator, the header is structurally validated and reported as `verified` (not `settled`).

```typescript
// src/lib/x402.ts — standard x402 header builder
export const buildX402HeaderValue = (payment: X402Payment): string =>
  Buffer.from(JSON.stringify(payment), 'utf-8').toString('base64')
```

### 4. Autonomous Rebalancing Execution

When `ENABLE_AUTONOMOUS_REBALANCE=1` is set and the AI recommends action (not "hold current allocation"), the agent **autonomously executes a native CSPR transfer** to the user's wallet:

- Uses `NativeTransferBuilder` with retry logic (3 attempts, 600ms backoff).
- Proves the agent doesn't just analyze — it **acts** on-chain.
- Returns the transaction hash for audit.

### 5. Server-Side Portfolio Fetch (CORS Bridge)

CSPR.cloud does not send CORS headers for browser origins. Instead of proxying through a third-party service, the app uses a **dedicated Next.js API route** (`/api/portfolio`) that:

- Validates the Casper public key format server-side.
- Enforces an 8-second timeout with `AbortController`.
- Returns structured portfolio data to the client.

### 6. Security Hardening

Production-grade headers configured in `next.config.mjs`:

- **Content-Security-Policy** — strict `default-src 'self'`, explicit `connect-src` whitelist for CSPR.cloud, OpenAI, Coingecko.
- **X-Frame-Options: DENY** — clickjacking protection.
- **Strict-Transport-Security** — HSTS with 2-year max-age.
- **X-Content-Type-Options: nosniff** — MIME sniffing protection.
- **Permissions-Policy** — disables camera, microphone, geolocation.
- **Referrer-Policy** — `strict-origin-when-cross-origin`.
- **`poweredByHeader: false`** — hides Next.js version fingerprint.

Input validation on every API route:
- Address length capped at 70 chars.
- Portfolio assets capped at 100 items.
- Numeric fields validated with `Number.isNaN` checks.
- Chat messages capped at 2000 characters.

### 7. Performance Optimizations

| Technique | Implementation |
|---|---|
| **SWC minification** | `swcMinify: true` in Next.js config |
| **Image optimization** | AVIF + WebP formats, 30-day cache TTL |
| **Gzip/Brotli compression** | `compress: true` |
| **CSPR price caching** | 60-second in-memory cache with stale fallback |
| **Fetch timeouts** | 8-second `AbortController` timeout on all external APIs |
| **CSS GPU acceleration** | Only `transform` and `opacity` animations |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all animations |
| **Static generation** | Landing page, 404, and Coming Soon prerendered at build time |

### 8. Accessibility (WCAG AA)

- Focus rings with `2px solid #06b6d4` and `1px` offset.
- `prefers-reduced-motion` disables starfield, twinkling, and shooting stars.
- Minimum contrast ratios met across all text/background pairs.
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`.
- Keyboard-navigable FAQ accordion and all interactive elements.

---

## Smart Contract (Odra / Rust)

The `PortfolioAgent` contract is written in **Rust with the Odra framework** and deployed on Casper Testnet.

```rust
#[odra::module]
pub struct PortfolioAgent {
    analyses: Mapping<String, Vec<AnalysisRecord>>,
}

#[odra::module_impl]
impl PortfolioAgent {
    pub fn store_analysis(
        &mut self,
        wallet_address: String,
        total_value: U256,
        risk_level: String,
        recommendation_count: u8,
        summary_hash: String,
    ) {
        // Emits event + stores record for audit trail
    }
}
```

- **Entry point:** `store_analysis` — records portfolio snapshot + AI risk level.
- **Events:** Emitted on every write for off-chain indexing.
- **Immutable:** Analysis records are append-only.

Full contract source: [`odra-project/`](./odra-project/)

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CSPR_CLOUD_API_KEY` | Yes | CSPR.cloud access token for live balances |
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o analysis and chat |
| `ANTHROPIC_API_KEY` | No | Anthropic API key for Claude fallback |
| `CASPER_AGENT_PRIVATE_KEY_PEM` | No | Agent's PEM private key for on-chain writes |
| `PORTFOLIO_AGENT_PACKAGE_HASH` | No | Deployed contract package hash |
| `X402_FACILITATOR_URL` | No | x402 facilitator base URL for real micropayments |
| `ENABLE_AUTONOMOUS_REBALANCE` | No | Set to `1` to enable autonomous CSPR transfers |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/thesithunyein/casper-ai-portfolio-agent.git
cd casper-ai-portfolio-agent

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run dev server
npm run dev

# 5. Build for production
npm run build
```

---

## Project Structure

```
casper-ai-portfolio-agent/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Server API routes
│   │   │   ├── analyze/        # AI analysis + on-chain write
│   │   │   ├── chat/           # Conversational agent
│   │   │   ├── portfolio/      # CSPR.cloud balance fetch
│   │   │   └── agent-status/   # Diagnostics endpoint
│   │   ├── page.tsx            # Landing page (galaxy theme)
│   │   ├── layout.tsx          # Root layout (Inter + IBM Plex Mono)
│   │   ├── globals.css         # Starfield animation + design tokens
│   │   ├── not-found.tsx       # 404 page
│   │   └── coming-soon/        # Coming soon page
│   ├── components/             # React components
│   │   ├── WalletConnect.tsx   # Manual key input + demo mode
│   │   ├── PortfolioDisplay.tsx
│   │   ├── AIAnalysis.tsx
│   │   ├── AgentChat.tsx
│   │   ├── LoadingState.tsx    # Shimmer skeleton
│   │   ├── ErrorState.tsx
│   │   └── Logo.tsx            # Geometric diamond mark
│   └── lib/                    # Core logic
│       ├── casper.ts           # CSPR.cloud + validation
│       ├── casper-agent.ts     # On-chain agent wallet
│       ├── x402.ts             # Micropayment protocol
│       ├── store.ts            # Zustand state
│       └── agent-chat.ts       # Chat action handlers
├── odra-project/               # Rust smart contract (Odra)
├── public/                     # Static assets
├── next.config.mjs             # Next.js + security headers
├── tailwind.config.ts          # Galaxy color palette
└── CHANGELOG.md                # Design evolution history
```

---

## Why This Wins

1. **Real transactions, not mocks.** Every `Analyze Portfolio` click can produce a signed, submitted Casper 2.0 transaction.
2. **Autonomous agent.** The AI decides whether to rebalance, and the agent executes without human approval.
3. **x402 native.** Built on Casper's own micropayment protocol, not a generic Stripe integration.
4. **Production security.** CSP, HSTS, input validation, timeouts, and error boundaries.
5. **Zero-dependency demo.** Works without any API keys via deterministic heuristic fallback.
6. **Performance-first.** 106 KB first load, GPU-composited animations, 60s price cache, 8s fetch timeouts.
7. **Accessibility.** `prefers-reduced-motion`, WCAG AA contrast, keyboard navigation.
8. **Professional craft.** Apple-quality easing curves, shimmer loading states, staggered entrances, press feedback.

---

## Team

Built for the **Casper Agentic Buildathon 2026**.

MIT License — see [LICENSE](./LICENSE).
