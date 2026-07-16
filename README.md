<div align="center">

<img src="public/profile-logo.svg" width="96" height="96" alt="Casper AI Agent Logo" />

# Casper AI Portfolio Agent

### Finalist · Casper Agentic Buildathon 2026

**Autonomous AI portfolio agent on Casper Testnet.**  
Reads holdings → pays itself via **x402** → analyzes risk with GPT-4o → **signs real Casper 2.0 txs** → rebalances without human approval.

[![Live](https://img.shields.io/badge/Live-casper--ai--portfolio--agent.vercel.app-22c55e?style=for-the-badge&logo=vercel)](https://casper-ai-portfolio-agent.vercel.app)
[![Finalist](https://img.shields.io/badge/Status-Finalist-ffd700?style=for-the-badge)](https://dorahacks.io/hackathon/casper-agentic-buildathon)
[![MIT](https://img.shields.io/badge/License-MIT-0ea5e9?style=for-the-badge)](./LICENSE)

**[Live App](https://casper-ai-portfolio-agent.vercel.app)** ·
**[Judge Playbook](./JUDGE_PLAYBOOK.md)** ·
**[Demo Video](https://youtu.be/3oaGutfrkKo)** ·
**[Contract](https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6)** ·
**[X](https://x.com/CasperAgentAI)** ·
**[Telegram](https://t.me/casperagent)**

</div>

---

## 60-second verify (judges start here)

1. Open **[the live app](https://casper-ai-portfolio-agent.vercel.app)** → **Try with Demo Account** → **Analyze Portfolio**
2. Confirm the activity log shows: portfolio → live RWA → **x402 settle** → AI → on-chain `store_analysis`
3. Click any tx hash → `testnet.cspr.live` must show **Success**
4. Optional: [`/api/agent-status`](https://casper-ai-portfolio-agent.vercel.app/api/agent-status) (secret-free diagnostics)

Full path: **[JUDGE_PLAYBOOK.md](./JUDGE_PLAYBOOK.md)**

---

## Why this is different

| Most AI hackathon demos | This project |
|---|---|
| Screenshots / mocked “tx hashes” | Real Casper 2.0 txs signed by an **agent wallet** |
| Stripe-style off-chain payments | **x402 micropayments** that settle on Testnet (0.01 CSPR) |
| Single LLM call labeled “agent” | **5 specialized agents** (Portfolio, Risk, Treasury, Oracle, Yield) |
| Fake price cards | **Live** Treasury.gov T-bill yields + CoinGecko PAXG/ONDO |
| Generic EVM copy-paste | **Odra/Rust** contract + Casper MCP / CSPR.cloud / CSPR.trade |

> Built against Casper’s own example directions: autonomous yield-routing via MCP + RWA intelligence + agentic on-chain execution.

---

## On-chain proof (copy onto DoraHacks BUIDL)

| Artifact | Value |
|---|---|
| **Package hash** | `2f76596281bab4993440f5bd88728a34faa1031ab4b7ce8e0064219e1ae2e03d` |
| **Contract (v1)** | [`0b4e53d2…04b6`](https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6) |
| **Sample `store_analysis` tx** | [`cc648f7d…7b779`](https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779) — Success · AI analysis recorded on-chain |
| **Contract install tx** | [`9460c0d3…dc0a`](https://testnet.cspr.live/transaction/9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a) — Odra PortfolioAgent install |
| **CI `store_analysis` tx** | `bca8c90f0326424745efb591a748c5d2e93ca3ce0a42c6e2580c69781239136a` — Success |

Landing page also ships a **Judge verification pack** with these links.

---

## Final Round criteria map

| Criterion | Evidence in this repo |
|---|---|
| **Technical Execution** | Next.js 14 + Odra/Rust, Jest + Playwright, CI, CodeQL, Dependabot, CSP/HSTS |
| **Innovation & Originality** | Closed agentic loop ending on-chain + x402 settle + multi-agent swarm on Casper |
| **Use of AI / Agentic Systems** | GPT-4o / Claude + heuristic fallback; agent signs txs without human approval |
| **Real-World Applicability** | Portfolio risk + RWA hedge advice from live T-bill / gold / ONDO feeds |
| **UX & Design** | Stripe-grade UI, demo mode, dark mode, WCAG AA, activity log with clickable txs |
| **Working Smart Contracts** | Deployed `PortfolioAgent` — 15 entry points, agent auth, RWA oracle, yield registry |
| **Long-Term Launch Plans** | Roadmap below + socials + mainnet / facilitator / CEP-18 milestones |
| **Long-Term Impact** | Open-source reference for Casper agentic DeFi + x402 + MCP |

---

## Agentic loop (what actually runs)

```
User / Demo wallet
        │
        ▼
 CSPR.cloud balances  +  Treasury.gov / CoinGecko RWA  +  MCP (optional)
        │
        ▼
 x402 micropayment settle (0.01 CSPR)  ← agent wallet OR HTTP facilitator
        │
        ▼
 GPT-4o / Claude / heuristic analysis
        │
        ▼
 Multi-agent swarm → store_analysis + optional autonomous rebalance
        │
        ▼
 Odra PortfolioAgent on Casper Testnet  (auditable tx hash in UI)
```

**x402 modes**

1. **Facilitator** — `X402_FACILITATOR_URL` → `/verify` + `/settle`
2. **Agent-wallet settle (shipped)** — if facilitator cannot settle, agent signs a real **0.01 CSPR** native transfer on Testnet and returns the explorer link

UI labels status honestly: `SETTLED ON-CHAIN` vs `VERIFIED` (header only).

---

## Demo video

[![Demo Video](https://img.youtube.com/vi/3oaGutfrkKo/maxresdefault.jpg)](https://www.youtube.com/watch?v=3oaGutfrkKo)

Wallet → analysis → on-chain proof → RWA → chat → rebalancing.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Next.js 14  ·  WalletConnect · Agent Chat · Portfolio · Proof   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
 /api/portfolio        /api/analyze           /api/chat
 (CSPR.cloud)      (AI + x402 + on-chain)     (OpenAI)
                             │
                             ▼
                    casper-agent.ts (signs)
                             │
                             ▼
              PortfolioAgent (Odra / Casper Testnet)
```

### Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind, Zustand |
| AI | GPT-4o → Claude 3.5 → deterministic heuristic |
| Chain | `casper-js-sdk` v5, Casper 2.0 txs |
| Contract | Odra / Rust — `PortfolioAgent` |
| Data | CSPR.cloud, Treasury.gov, CoinGecko, Casper MCP |
| Payments | x402 (facilitator + agent-wallet settle) |
| Deploy | Vercel |

---

## Contract entry points (high level)

| Entry point | Who | Purpose |
|---|---|---|
| `store_analysis` | Authorized agent | Persist analysis hash + risk on-chain |
| `set_target_allocation` | Risk agent | Target CSPR / stable / RWA / DeFi % |
| `execute_rebalance` | Treasury agent | Record rebalance + RWA context |
| `update_rwa_prices` | Oracle agent | Post T-bill / PAXG / ONDO / CSPR |
| `register_yield_opportunity` | Yield router | DeFi APY / TVL / risk registry |
| `authorize_agent` / `revoke_agent` | Owner | Agent ACL |
| `get_*` | Anyone | Read-only queries |

Source: [`odra-project/`](./odra-project/)

---

## Quick start

```bash
git clone https://github.com/thesithunyein/casper-ai-portfolio-agent.git
cd casper-ai-portfolio-agent
npm install
cp .env.example .env.local   # add CSPR.cloud + OpenAI (optional) + agent PEM
npm run dev
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CSPR_CLOUD_API_KEY` | Yes | Live balances |
| `OPENAI_API_KEY` | Recommended | GPT analysis (else heuristic) |
| `CASPER_AGENT_PRIVATE_KEY_PEM` | For on-chain | Agent signs txs + x402 settle |
| `PORTFOLIO_AGENT_PACKAGE_HASH` | For on-chain | Deployed package hash |
| `X402_FACILITATOR_URL` | Optional | HTTP facilitator settle |
| `ENABLE_AUTONOMOUS_REBALANCE` | Optional | `1` = native rebalance transfers |

---

## Roadmap & launch

| When | Milestone | Status |
|---|---|---|
| Q2 2026 | MVP on Casper Testnet (analysis, Odra, rebalance) | **Shipped** |
| Jul 2026 | Final Round: real x402 settle, judge proof pack, CodeQL/Dependabot | **Shipped** |
| Q3 2026 | Live x402 HTTP facilitator settle + on-chain RWA oracle writes | In progress |
| Q3 2026 | Mainnet PortfolioAgent (audit) | Planned |
| Q4 2026 | CEP-18 multi-token portfolio + deeper CSPR.trade MCP routes | Planned |
| Q1 2027 | Mobile PWA + Casper Wallet / Ledger + multi-agent mesh | Planned |

**Socials:** [@CasperAgentAI](https://x.com/CasperAgentAI) · [Telegram](https://t.me/casperagent)

---

## Security & quality

- CodeQL + Dependabot + CI (web lint/build, Playwright, Odra WASM)
- CSP, HSTS, input caps, fetch timeouts
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) · [CONTRIBUTING.md](./CONTRIBUTING.md)
- Keep `main` deployable at all times (Final Round rule)

---

## Team

**Sithu Nyein** — solo builder  
GitHub: [@thesithunyein](https://github.com/thesithunyein)

Built for the **Casper Agentic Buildathon 2026 — Final Round**.

MIT — see [LICENSE](./LICENSE).
