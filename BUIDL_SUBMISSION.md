# BUIDL Submission - Casper AI Portfolio Agent

## Project Name
Casper AI Portfolio Agent

## One-Liner
An adorable, conversational AI portfolio manager for the Casper Network that pays for its own analysis via x402 micropayments and stores results on-chain.

## Problem
DeFi portfolio management is intimidating. Most tools are dark, complex, and require deep blockchain knowledge. There are no friendly, approachable AI agents for the Casper ecosystem that can analyze portfolios, answer questions in natural language, operate autonomously, and persist analysis results on-chain.

## Solution
A cute, conversational AI agent (with a bear mascot!) that:
1. Fetches your Casper portfolio via CSPR.cloud API
2. Lets you chat with an AI agent about your holdings ("Should I buy more CSPR?")
3. Pays for AI analysis via Casper's x402 micropayment protocol
4. Stores results on-chain via an Odra upgradeable smart contract
5. Generates real-time rebalancing recommendations using Claude 3.5 Sonnet

## Key Features
- **Agent Chat** — Conversational AI with context awareness and one-click action buttons
- **x402 Integration** — HTTP-native micropayments (0.01 CSPR per analysis with cryptographic proof)
- **Smart Contract** — Odra/Rust upgradeable contract deployed on Casper Testnet
- **Real AI Analysis** — Claude 3.5 Sonnet API generates personalized portfolio insights
- **Cute UI** — Pink accents, bear mascot, floating animations — stands out from generic DeFi apps
- **Real Data** — CSPR.cloud REST API for live Casper Testnet balances

## Tech Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **AI:** Claude 3.5 Sonnet API with structured JSON output
- **Blockchain:** casper-js-sdk + CSPR.cloud REST API
- **Smart Contracts:** Odra Framework (Rust) — upgradeable, deployed on Testnet
- **Payments:** x402 Micropayment Protocol (HTTP-native CSPR payments)
- **State:** Zustand lightweight state management

## Judging Criteria Alignment

| Criterion | How this project addresses it |
|-----------|-------------------------------|
| Technical Execution | TypeScript frontend + Rust/Odra contract, modular `src/lib` integration layer, CI for web and WASM builds. |
| Innovation & Originality | Friendly, approachable agentic DeFi assistant on Casper combining an AI agent, x402 micropayments, and on-chain analysis storage. |
| Use of AI / Agentic Systems | Claude 3.5 Sonnet powers both the structured analysis (`/api/analyze`) and the conversational agent (`/api/chat`), grounded in live portfolio context. |
| Real-World Applicability | Portfolio risk assessment and rebalancing is a genuine DeFi need; reads live Testnet balances via CSPR.cloud. |
| User Experience & Design | Distinctive, polished cute UI with a bear mascot that stands out from generic dark DeFi dashboards. |
| Working Smart Contracts | Odra contract (`odra-project/`) storing analysis results on Casper Testnet. |
| Long-Term Launch Plans | Roadmap toward live x402 Facilitator settlement, full CEP-18 indexing, and community voting. |
| Potential for Long-Term Impact | Open-source reference for building agentic AI dApps on Casper. |

## Contract Address (Testnet)
**Status:** Pending deployment. The contract source lives in `odra-project/` and is built to WASM in CI (`.github/workflows/ci.yml`). Deploy with the `build-and-deploy` workflow (requires a funded Casper Testnet key in the `CSPR_TESTNET_PRIVATE_KEY` secret), then fill in:

**Deploy Hash:** (To be filled after deployment)
**Contract Hash:** (To be filled after deployment)
**Explorer:** https://testnet.cspr.live/contract/[contract-hash]

## Demo Video
📺 YouTube: (Link to be added after recording — follow DEMO_SCRIPT.md)

## GitHub
https://github.com/thesithunyein/casper-ai-portfolio-agent

## Live Demo
https://casper-ai-portfolio-agent.vercel.app

## Team
Solo builder — thesithunyein
- GitHub: https://github.com/thesithunyein
- Twitter/X: (To be created per SOCIAL_MEDIA_LAUNCH.md)

## Socials & Community
- Twitter/X: @CasperAgent (launch per SOCIAL_MEDIA_LAUNCH.md)
- Casper Developer Discord: Active in #showcase
- GitHub: Open-source with full documentation

## Future Plans
- **Mainnet x402 deployment** — Production micropayments for agent autonomy
- **MCP server expansion** — Connect to CSPR.trade, more DeFi protocols
- **Multi-agent DAO governance** — Swarm of specialized agents (Risk, Treasury, Legal)
- **Mobile app** — React Native with push notifications for portfolio alerts
- **Grant application** — Casper Ecosystem Fund for continued development

## Deployment Instructions
```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local with your ANTHROPIC_API_KEY and CSPR_CLOUD_API_KEY

# 3. Deploy smart contract (requires CSPR Testnet tokens)
cd contract && node deploy.js

# 4. Run locally
npm run dev

# 5. Deploy to Vercel
vercel --prod
```
