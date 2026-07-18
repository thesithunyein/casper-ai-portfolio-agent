# BUIDL Submission — Casper AI Portfolio Agent

**Event:** Casper Agentic Buildathon 2026 — Final Round  
**Status:** Finalist  
**Builder:** Sithu Nyein (@thesithunyein)

## One-liner

Autonomous AI portfolio agent on Casper Testnet that settles x402 micropayments, analyzes risk with GPT-4o, signs real Casper 2.0 transactions, and exposes agent reputation — without human approval.

## Links (must match live site + README)

| Resource | URL |
|---|---|
| Live app | https://casper-ai-portfolio-agent.vercel.app |
| GitHub | https://github.com/thesithunyein/casper-ai-portfolio-agent |
| Demo script | [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) |
| Judge playbook | [JUDGE_PLAYBOOK.md](./JUDGE_PLAYBOOK.md) |
| Contract | https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6 |
| X | https://x.com/CasperAgentAI |
| Telegram | https://t.me/casperagent |

## On-chain (paste onto DoraHacks)

| Artifact | Value |
|---|---|
| Package hash | `2f76596281bab4993440f5bd88728a34faa1031ab4b7ce8e0064219e1ae2e03d` |
| Contract hash | `0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6` |
| Sample `store_analysis` tx | `cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779` — Success · AI analysis recorded |
| Install tx | `9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a` — Odra install |
| CI `store_analysis` | `bca8c90f0326424745efb591a748c5d2e93ca3ce0a42c6e2580c69781239136a` — Success |

## Key features (same as live app)

1. **Agent wallet signing** — real Casper 2.0 `store_analysis` txs  
2. **x402 settle** — facilitator or agent-wallet 0.01 CSPR with explorer proof  
3. **5-agent swarm** — Portfolio, Risk, Treasury, Oracle, Yield Router  
4. **Live RWA** — Treasury.gov T-bill + CoinGecko PAXG/ONDO  
5. **Agent Reputation** — 0–100 score committed via summary hash  
6. **Judge proof pack** — package hash + sample txs on the landing page  
7. **Odra/Rust contract** — deployed on Casper Testnet  

## Tech stack

Next.js 14 · TypeScript · Zustand · GPT-4o/Claude · casper-js-sdk · Odra/Rust · CSPR.cloud · x402 · Vercel

## How judges test

See [JUDGE_PLAYBOOK.md](./JUDGE_PLAYBOOK.md) — Demo account → Analyze → click txs.
