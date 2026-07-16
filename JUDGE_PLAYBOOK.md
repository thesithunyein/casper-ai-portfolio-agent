# Judge Playbook — Casper AI Portfolio Agent

60-second path for Final Round reviewers. No marketing — just how to verify the MVP.

## Prerequisites

- Live app: https://casper-ai-portfolio-agent.vercel.app
- Repo: https://github.com/thesithunyein/casper-ai-portfolio-agent
- Network: Casper Testnet

## Step-by-step test

1. Open the live app.
2. Scroll to **Connect Wallet** (or click **Start Analyzing**).
3. Click **Try with Demo Account** — no wallet extension required.
4. Click **Analyze Portfolio**.
5. Watch the **Agent Activity Log** — portfolio fetch → RWA feed → x402 → AI → on-chain write.
6. Confirm results show:
   - Risk assessment + recommendations
   - **x402 Micropayment** card (status `SETTLED ON-CHAIN` when agent key is live)
   - **On-Chain Record** with a `store_analysis` transaction link to testnet.cspr.live
   - Multi-agent coordination panel
7. Click any transaction hash → explorer must show **Success**.
8. Optional: open `/api/agent-status` for secret-free config diagnostics.

## On-chain artifacts (must be listed on BUIDL page too)

| Artifact | Value / link |
|---|---|
| Package hash | `2f76596281bab4993440f5bd88728a34faa1031ab4b7ce8e0064219e1ae2e03d` |
| Contract | https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6 |
| Sample `store_analysis` tx | https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779 |
| Contract install tx | https://testnet.cspr.live/transaction/9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a |

## What “working” means for this project

- Transaction-producing on-chain component: Odra `PortfolioAgent.store_analysis`
- Agentic loop: AI decides → agent wallet signs → Testnet confirms
- x402: analysis settles a real 0.01 CSPR micropayment (agent wallet) when configured; HTTP facilitator path supported via `X402_FACILITATOR_URL`
- RWA: live Treasury.gov T-bill yield + CoinGecko PAXG/ONDO

## Demo video

https://youtu.be/3oaGutfrkKo
