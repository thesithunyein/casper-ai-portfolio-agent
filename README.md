# Casper AI Portfolio Agent

**Agentic AI-powered portfolio analysis with cute design for the Casper Network.**

Analyze your Casper portfolio with Claude AI and get actionable insights, risk assessments, and rebalancing recommendations — all through a conversational AI agent that can pay for analysis via x402 micropayments. Wrapped in an adorable, animated interface with a friendly bear mascot.

---

## What This Does

1. **Connect your Casper wallet** – Enter your wallet address (no private keys needed)
2. **Fetch your portfolio** – Real-time balance data from Casper blockchain via CSPR.cloud API
3. **Chat with your AI Agent** – Conversational portfolio manager that answers questions and takes actions
4. **Pay via x402** – Agent pays 0.01 CSPR per analysis using Casper's micropayment protocol
5. **AI analysis** – Claude 3.5 Sonnet analyzes your holdings
6. **Get insights** – Risk assessment, diversification analysis, and rebalancing suggestions
7. **Store on-chain** – The AI agent autonomously signs and submits a real Casper 2.0 transaction to store the analysis in the PortfolioAgent contract on Testnet

---

## Key Features

### AI-Powered Analysis
- **Portfolio Summary** – Clear breakdown of your holdings and allocation
- **Risk Assessment** – Volatility, concentration, and diversification analysis
- **Smart Recommendations** – 3-5 actionable insights tailored to your portfolio
- **Rebalancing Suggestions** – Target allocations with detailed reasoning

### Casper Integration
- **CSPR.cloud API** – REST API for fetching live balances from Casper Testnet
- **x402 Micropayments** – HTTP-native payment protocol for agent-per-request billing
- **MCP-ready** – Designed to plug into Casper MCP servers for AI agent blockchain queries (roadmap)
- **Smart Contract** – Odra-based contract stores analysis results on-chain
- **Multi-asset support** – CSPR, USDC, USDT, WETH, and more

### User Interface
- **Cute, friendly design** – Light theme with pink accents, rounded cards, and playful animations
- **Bear mascot logo** – Custom-designed cute bear icon as the app logo
- **Agent Chat** – Conversational AI interface with actionable buttons
- **Responsive layout** – Works seamlessly on desktop, tablet, and mobile
- **Real-time feedback** – Loading states, error handling, retry logic
- **Smooth animations** – Floating particles, bouncing icons, pulsing hearts, and hover effects
- **Lucide icons** – Sparkles, hearts, stars, rainbows, and other cute icons throughout

---

## Agentic Features

### Conversational AI Agent
- **Natural language queries** – "Should I buy more CSPR?" "What's my risk level?"
- **Context-aware responses** – Agent knows your portfolio and analysis history
- **Action buttons** – One-click analyze, rebalance, or pay via x402
- **Personality** – Friendly, cute bear agent with emoji and sparkle decorations

### x402 Micropayments
- **Pay-per-analysis** – 0.01 CSPR per AI analysis request
- **Facilitator-ready** – Two modes: (a) **demo** — structurally verified when no facilitator URL configured; (b) **live** — verified & settled on-chain through the Casper x402 Facilitator when `X402_FACILITATOR_URL` is set
- **Agent autonomy** – AI agent pays for its own computation via an `x402-payment` HTTP header
- **HTTP-native** – Standard HTTP headers for payment (no wallet popup)

### Smart Contract (Odra/Rust)
- **On-chain storage** – Portfolio analysis results stored on Casper Testnet
- **Query by address** – Retrieve any wallet's analysis history
- **Counter tracking** – Total analyses performed by the agent
- **Upgradeable** – Casper's native upgradable contract support

## Design Philosophy

This project combines **powerful AI analysis** with a **delightful, approachable UI**:

- **Nunito font** – Rounded, friendly typography for a welcoming feel
- **Pink accent palette** – Soft pinks (`#ffb6c1`, `#ff69b4`) alongside cyan and blue
- **Extra-rounded corners** – `rounded-3xl` cards and `rounded-2xl` icons for a soft, cute aesthetic
- **Animated decorations** – Floating particles, bouncing sparkles, and pulsing hearts
- **Gradient buttons** – Smooth primary-to-secondary gradients on all CTAs
- **Bear mascot** – A custom-designed cute bear logo that appears in the navbar and favicon

## Architecture

```
┌──────────────────────────────────────────┐
│   Next.js 14 Frontend (React 18)         │
│   - Wallet input                         │
│   - Portfolio display                    │
│   - AI analysis + on-chain proof card    │
└──────────────┬───────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────────┐
│ CSPR.cloud  │  │ Claude AI       │
│ REST API    │  │ (Anthropic)     │
│ (Testnet)   │  │ 3.5 Sonnet      │
└─────────────┘  └─────────────────┘
       │                │
       │  Agent signs & │
       │  submits TX    │
       │                │
┌──────▼──────────────┐│
│ Casper Testnet      ││
│ PortfolioAgent      ││
│ Odra Contract       ││
│ (store_analysis)    ││
└─────────────────────┘│
```

### How AI is Used

**Core AI Integration:** Claude 3.5 Sonnet analyzes your portfolio with:

1. **Portfolio data input** – Your holdings, amounts, percentages, USD values
2. **Prompt engineering** – Specialized prompt for crypto portfolio analysis
3. **JSON response parsing** – Structured output for summary, risk, recommendations, rebalancing
4. **Real-time generation** – AI generates insights on-demand (no pre-computed responses)
5. **Autonomous on-chain write** – The agent signs and submits a `store_analysis` Casper 2.0 transaction via `casper-js-sdk`, producing a real on-chain record with a cspr.live link

**Example AI output:**
```json
{
  "summary": "Your portfolio is concentrated in CSPR (62%) with stable assets (USDC/USDT) making up 38%. This is a growth-focused Casper-native allocation.",
  "riskAssessment": "Moderate risk. High CSPR concentration exposes you to single-asset volatility, but stablecoins provide downside protection.",
  "recommendations": [
    "Consider reducing CSPR to 50-55% and increasing stablecoin allocation to 45-50%",
    "Monitor CSPR price movements; set stop-losses at -15% from current price",
    "Diversify into WETH (5-10%) for Ethereum ecosystem exposure"
  ],
  "rebalancingSuggestion": {
    "action": "Rebalance to 50% CSPR, 35% USDC, 10% USDT, 5% WETH",
    "targetAllocation": { "CSPR": 50, "USDC": 35, "USDT": 10, "WETH": 5 },
    "reasoning": "This allocation reduces concentration risk while maintaining growth exposure..."
  }
}
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key (get free credits at [console.anthropic.com](https://console.anthropic.com))
- A Casper account public key (starts with `01` or `02`). Create and fund one on the [Casper Testnet faucet](https://testnet.cspr.live/tools/faucet)
- (Optional) A [CSPR.cloud](https://cspr.cloud) API key to read live Testnet balances

### Installation

```bash
git clone https://github.com/thesithunyein/casper-ai-portfolio-agent.git
cd casper-ai-portfolio-agent
npm install
```

### Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Required for AI analysis (server-side)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Casper network (defaults to testnet)
NEXT_PUBLIC_CASPER_NETWORK=testnet

# Optional: live balances from CSPR.cloud (falls back to demo data if unset)
NEXT_PUBLIC_CSPR_CLOUD_API_KEY=your-cspr-cloud-key

# x402 recipient address (for demo mode verification)
NEXT_PUBLIC_X402_RECIPIENT=your_casper_wallet_address_here

# x402 Facilitator (set for real on-chain settlement)
X402_FACILITATOR_URL=

# Contract package hash after deployment (for agent on-chain writes)
PORTFOLIO_AGENT_PACKAGE_HASH=your_contract_package_hash_here

# Agent signing key — fund a Testnet key, then add its PEM or hex (server-side only)
CASPER_AGENT_PRIVATE_KEY_PEM=
# CASPER_AGENT_PRIVATE_KEY_HEX=
# CASPER_AGENT_KEY_ALGORITHM=ed25519  # or secp256k1
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start analyzing!

---

## How to Use

1. **Enter wallet address** – Paste your Casper public key (starts with `01` or `02`)
2. **Click "Analyze Portfolio"** – Fetches your holdings and runs AI analysis
3. **Review results** – See portfolio breakdown, risk assessment, and recommendations
4. **Take action** – Use insights to rebalance your portfolio

### Example Workflow

```
Input: 01abc123... (Casper public key)
  |
Fetch balances from CSPR.cloud (Casper Testnet)
  |
Send to Claude AI for analysis
  |
Display results:
  - Portfolio composition
  - Risk assessment
  - 5 actionable recommendations
  - Rebalancing targets
```

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router) - React 18 - TypeScript
- **Styling:** Tailwind CSS with custom cute theme extensions
- **Typography:** Nunito (Google Fonts) – rounded, friendly typeface
- **Icons:** Lucide React (Sparkles, Heart, Star, Rainbow, Zap, Bot, etc.)
- **Animations:** CSS keyframes (bounce, pulse, float) + Tailwind transitions
- **Blockchain:** casper-js-sdk + CSPR.cloud REST API - Casper Testnet
- **Smart Contracts:** Odra Framework (Rust) - Upgradeable contracts
- **AI:** Anthropic Claude 3.5 Sonnet API + Agent Chat Engine
- **Payments:** x402 Micropayment Protocol (HTTP-native CSPR payments)
- **State:** Zustand (lightweight state management)
- **Deployment:** Vercel (recommended)

---

## Casper Buildathon Judging Criteria Alignment

| Criterion | How this project addresses it |
|-----------|-------------------------------|
| **Technical Execution** | TypeScript frontend + Rust/Odra contract, modular `src/lib` integration layer, CI for both web and WASM builds. |
| **Innovation & Originality** | A friendly, approachable agentic DeFi assistant on Casper combining an AI agent, x402 micropayments, and on-chain analysis storage. |
| **Use of AI / Agentic Systems** | Claude 3.5 Sonnet powers both the structured portfolio analysis and the conversational agent chat, grounded in live portfolio context. |
| **Real-World Applicability** | Portfolio risk assessment and rebalancing is a genuine DeFi need; reads live Testnet balances via CSPR.cloud. |
| **User Experience & Design** | Distinctive, polished cute UI with a bear mascot that stands out from generic dark DeFi dashboards. |
| **Working Smart Contracts** | Odra contract (`odra-project/`) that stores and retrieves analysis results on Casper Testnet. |
| **Long-Term Launch Plans** | Roadmap toward live x402 Facilitator settlement, full CEP-18 indexing, and community voting. |
| **Potential for Long-Term Impact** | Open-source reference for building agentic AI dApps on Casper. |

---

## Features Breakdown

### Portfolio Fetching
- Queries Casper blockchain via CSPR.cloud REST API
- Supports Casper Testnet (ready for mainnet)
- Handles CSPR, CEP-18 tokens, and multi-asset portfolios
- Real-time balance updates

### AI Analysis Engine
- Uses Claude 3.5 Sonnet for portfolio intelligence
- Specialized prompt for DeFi portfolio analysis
- Generates 5+ recommendations per analysis
- x402 payment verification for premium features
- Provides risk-weighted suggestions

### Agent Chat
- Conversational interface with natural language understanding
- Context-aware responses based on portfolio state
- One-click action buttons (analyze, rebalance, pay)
- Cute bear personality with sparkle animations

### x402 Payments
- HTTP-native micropayment protocol
- 0.01 CSPR per analysis with cryptographic proof
- Payment verification in API layer
- Foundation for agent autonomy

### Smart Contract (Odra)
- Rust-based upgradeable contract
- Stores analysis results on Casper Testnet
- Query analysis history by wallet address
- Counter for total analyses performed

### UI/UX
- **Light theme** with cyan, blue, and pink accent colors
- **Extra-rounded cards** (`rounded-3xl`) with soft shadows
- **Gradient icon containers** with playful bounce/pulse animations
- **Cute Lucide icons** – Sparkles, hearts, stars, rainbows, and more
- Agent Chat with sticky sidebar on desktop
- Smooth loading animations with bouncing dots
- Error recovery with friendly "Oopsie!" messages
- Mobile-optimized touch targets

---

## Security

- **No private keys stored** – Only reads public wallet data
- **API keys in environment** – Never hardcoded
- **Client-side validation** – Address format checking before API calls
- **Error handling** – Graceful failures with user-friendly messages

---

## Example Output

```
Total Portfolio Value: $2,450.50

Assets:
- CSPR: 250,000 tokens (68% of portfolio, $1,667.50)
- USDC: 500 tokens (20% of portfolio, $500.00)
- USDT: 250 tokens (10% of portfolio, $250.00)
- WETH: 0.1 tokens (2% of portfolio, $33.00)

AI Analysis:
Summary: Your portfolio is growth-focused with CSPR dominance...
Risk: Moderate. High concentration in CSPR...
Recommendations:
1. Reduce CSPR to 50-55% for better diversification
2. Increase stablecoin allocation to 45-50%
3. Add WETH for Ethereum ecosystem exposure
4. Set stop-loss at -15% from current CSPR price
5. Monitor market conditions weekly

On-chain Record:
Transaction: abcdef...1234 (testnet.cspr.live/transaction/...)
Entry Point: store_analysis
Contract: PortfolioAgent (Odra)

Rebalancing Target:
- CSPR: 50% (from 68%)
- USDC: 35% (from 20%)
- USDT: 10% (from 10%)
- WETH: 5% (from 2%)
```

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
vercel
```

Set environment variables in Vercel dashboard:
- `ANTHROPIC_API_KEY` (required for live Claude AI)
- `NEXT_PUBLIC_CASPER_NETWORK` (`testnet` or `mainnet`)
- `NEXT_PUBLIC_CSPR_CLOUD_API_KEY` (optional, for live balances)
- `NEXT_PUBLIC_X402_RECIPIENT` (for x402 demo mode)
- `X402_FACILITATOR_URL` (for live on-chain x402 settlement)
- `PORTFOLIO_AGENT_PACKAGE_HASH` (after contract deploy)
- `CASPER_AGENT_PRIVATE_KEY_PEM` (server-side only — for on-chain writes)

### Deploy to Other Platforms

Works with any Node.js hosting (Netlify, Railway, Heroku, etc.)

---

## Roadmap

- [x] Cute, friendly UI design with bear mascot
- [x] Animated decorations and playful interactions
- [x] Agent autonomously records analysis on-chain via `casper-js-sdk`
- [x] x402 Facilitator-ready verify/settle flow
- [ ] Multi-wallet tracking
- [ ] Portfolio history and performance charts
- [ ] Price alerts
- [ ] One-click rebalancing execution
- [ ] Recurring analysis schedules
- [ ] Export reports (PDF/CSV)
- [ ] Dark/light theme toggle
- [ ] Full CEP-18 token indexing via CSPR.cloud
- [ ] Live x402 Facilitator settlement on Casper Mainnet

---

## License

MIT – Feel free to fork, modify, and deploy.

---

## Contributing

Contributions welcome. Please:
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

---

## Support

- **Issues:** GitHub Issues
- **Questions:** Open a Discussion
- **Feedback:** Reach out on X/Twitter

---

## Casper Buildathon Submission

**Hackathon:** Casper Agentic Buildathon 2026 - Qualification Round  
**Track:** Casper Innovation Track  
**Prize Pool:** $150,000 USD  
**Author:** [thesithunyein](https://github.com/thesithunyein)  
**Live Demo:** [casper-ai-portfolio-agent.vercel.app](https://casper-ai-portfolio-agent.vercel.app)

### Submission Includes
- Source code (Next.js + TypeScript + Rust smart contract)
- Working prototype deployed on Casper Testnet
- Open-source GitHub repository
- Demo video (to be recorded before June 30 deadline)

### Key Differentiators
1. **Cute UI** – First adorable, friendly DeFi agent on Casper
2. **x402 Integration** – Agent pays for its own analysis via micropayments
3. **Agent Chat** – Conversational AI that can query blockchain and take actions
4. **Smart Contract** – Odra-based upgradeable contract for on-chain analysis storage
5. **MCP Ready** – Model Context Protocol for AI-blockchain interaction
