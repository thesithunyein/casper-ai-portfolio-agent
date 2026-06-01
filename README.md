# Injective AI Portfolio Agent

**AI-powered portfolio analysis and intelligent rebalancing for Injective blockchain.**

Analyze your Injective portfolio with Claude AI and get actionable insights, risk assessments, and rebalancing recommendations in seconds.

---

## What This Does

1. **Connect your Injective wallet** – Enter your wallet address (no private keys needed)
2. **Fetch your portfolio** – Real-time balance data from Injective blockchain
3. **AI analysis** – Claude 3.5 Sonnet analyzes your holdings
4. **Get insights** – Risk assessment, diversification analysis, and rebalancing suggestions
5. **Actionable recommendations** – Specific steps to optimize your portfolio

---

## Key Features

### AI-Powered Analysis
- **Portfolio Summary** – Clear breakdown of your holdings and allocation
- **Risk Assessment** – Volatility, concentration, and diversification analysis
- **Smart Recommendations** – 3-5 actionable insights tailored to your portfolio
- **Rebalancing Suggestions** – Target allocations with detailed reasoning

### Injective Integration
- **Direct blockchain queries** – Fetches live balances from Injective testnet/mainnet
- **Real-time data** – No delays, no caching (optional caching for performance)
- **Multi-asset support** – INJ, USDC, USDT, WETH, and more
- **Accurate valuations** – Live price feeds for portfolio valuation

### User Interface
- **Dark mode design** – Modern gradient interface with Tailwind CSS
- **Responsive layout** – Works on desktop, tablet, and mobile
- **Real-time feedback** – Loading states, error handling, retry logic
- **Smooth animations** – Framer Motion for polished interactions

---

## Architecture

```
┌─────────────────────────────────────────┐
│   Next.js 14 Frontend (React 18)        │
│   - Wallet input                        │
│   - Portfolio display                   │
│   - AI analysis results                 │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────────┐
│ Injective   │  │ Claude AI       │
│ SDK         │  │ (Anthropic)     │
│ (Testnet)   │  │ 3.5 Sonnet      │
└─────────────┘  └─────────────────┘
```

### How AI is Used

**Core AI Integration:** Claude 3.5 Sonnet analyzes your portfolio with:

1. **Portfolio data input** – Your holdings, amounts, percentages, USD values
2. **Prompt engineering** – Specialized prompt for crypto portfolio analysis
3. **JSON response parsing** – Structured output for summary, risk, recommendations, rebalancing
4. **Real-time generation** – AI generates insights on-demand (no pre-computed responses)

**Example AI output:**
```json
{
  "summary": "Your portfolio is heavily concentrated in INJ (68%) with stable assets (USDC/USDT) making up 32%. This is a growth-focused allocation.",
  "riskAssessment": "Moderate risk. High INJ concentration exposes you to single-asset volatility, but stablecoins provide downside protection.",
  "recommendations": [
    "Consider reducing INJ to 50-55% and increasing stablecoin allocation to 45-50%",
    "Monitor INJ price movements; set stop-losses at -15% from current price",
    "Diversify into WETH (5-10%) for Ethereum ecosystem exposure"
  ],
  "rebalancingSuggestion": {
    "action": "Rebalance to 50% INJ, 35% USDC, 10% USDT, 5% WETH",
    "targetAllocation": { "INJ": 50, "USDC": 35, "USDT": 10, "WETH": 5 },
    "reasoning": "This allocation reduces concentration risk while maintaining growth exposure..."
  }
}
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key (get free credits at [console.anthropic.com](https://console.anthropic.com))
- An Injective wallet address (testnet or mainnet)

### Installation

```bash
git clone https://github.com/thesithunyein/injective-ai-portfolio-agent.git
cd injective-ai-portfolio-agent
npm install
```

### Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_INJECTIVE_NETWORK=testnet
NEXT_PUBLIC_INJECTIVE_CHAIN_ID=injective-888
NEXT_PUBLIC_INJECTIVE_ENV=testnet
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start analyzing!

---

## How to Use

1. **Enter wallet address** – Paste your Injective address (starts with `inj`)
2. **Click "Analyze Portfolio"** – Fetches your holdings and runs AI analysis
3. **Review results** – See portfolio breakdown, risk assessment, and recommendations
4. **Take action** – Use insights to rebalance your portfolio

### Example Workflow

```
Input: inj1abc123...
  |
Fetch balances from Injective
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
- **Styling:** Tailwind CSS - Framer Motion - Lucide Icons
- **Blockchain:** @injectivelabs/sdk-ts - Injective testnet/mainnet
- **AI:** Anthropic Claude 3.5 Sonnet API
- **State:** Zustand (lightweight state management)
- **Deployment:** Vercel (recommended)

---

## Judging Criteria Alignment

| Criterion | How We Score |
|-----------|-------------|
| **Usefulness (30%)** | Solves real problem: traders need portfolio analysis. Direct Injective integration. |
| **Execution (30%)** | Production-ready code. Error handling. Loading states. Mobile-responsive UI. |
| **Simplicity (20%)** | One clear flow: input -> analyze -> results. No feature bloat. |
| **Code Quality (15%)** | Clean TypeScript. Modular components. Well-documented. Easy to fork/extend. |
| **Future Potential (5%)** | Extensible: add trading execution, alerts, multi-wallet tracking, portfolio history. |

---

## Features Breakdown

### Portfolio Fetching
- Queries Injective blockchain via gRPC
- Supports testnet and mainnet
- Handles multiple asset types
- Real-time balance updates

### AI Analysis Engine
- Uses Claude 3.5 Sonnet (latest model)
- Specialized prompt for DeFi portfolio analysis
- Generates 5+ recommendations per analysis
- Provides risk-weighted suggestions

### UI/UX
- Dark mode with cyan/blue accent colors
- Responsive grid layout
- Smooth loading animations
- Error recovery with retry buttons
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
- INJ: 250 tokens (68% of portfolio, $1,667.50)
- USDC: 500 tokens (20% of portfolio, $500.00)
- USDT: 250 tokens (10% of portfolio, $250.00)
- WETH: 0.1 tokens (2% of portfolio, $33.00)

AI Analysis:
Summary: Your portfolio is growth-focused with INJ dominance...
Risk: Moderate. High concentration in INJ...
Recommendations:
1. Reduce INJ to 50-55% for better diversification
2. Increase stablecoin allocation to 45-50%
3. Add WETH for Ethereum ecosystem exposure
4. Set stop-loss at -15% from current INJ price
5. Monitor market conditions weekly

Rebalancing Target:
- INJ: 50% (from 68%)
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
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_INJECTIVE_NETWORK`
- `NEXT_PUBLIC_INJECTIVE_CHAIN_ID`
- `NEXT_PUBLIC_INJECTIVE_ENV`

### Deploy to Other Platforms

Works with any Node.js hosting (Netlify, Railway, Heroku, etc.)

---

## Roadmap

- [ ] Multi-wallet tracking
- [ ] Portfolio history and performance charts
- [ ] Price alerts
- [ ] One-click rebalancing execution
- [ ] Recurring analysis schedules
- [ ] Export reports (PDF/CSV)
- [ ] Dark/light theme toggle
- [ ] Support for more Injective assets

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

**Built for:** Injective Solo AI Builder Sprint  
**Author:** [thesithunyein](https://github.com/thesithunyein)  
**Live Demo:** [injective-ai-portfolio-agent.vercel.app](https://injective-ai-portfolio-agent.vercel.app)
