# Quick Start (5 minutes)

Get the Casper AI Portfolio Agent running locally in 5 minutes.

---

## 1. Clone & Install

```bash
git clone https://github.com/thesithunyein/casper-ai-portfolio-agent.git
cd casper-ai-portfolio-agent
npm install
```

---

## 2. Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up (free tier includes credits)
3. Copy your API key

---

## 3. Setup Environment

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
```

---

## 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 5. Test It

1. Enter a Casper public key (starts with `01` or `02`).
   - Get a funded Testnet account from the [faucet](https://testnet.cspr.live/tools/faucet).
2. Click "Analyze Portfolio".
3. Review the AI analysis and chat with the agent.

> Without a `NEXT_PUBLIC_CSPR_CLOUD_API_KEY`, the app uses clearly-labelled demo
> balances so the flow still works end-to-end.

---

## What You'll See

1. **Portfolio Display** – Holdings, amounts, percentages
2. **AI Analysis** – Claude-generated portfolio summary
3. **Risk Assessment** – Volatility and concentration analysis
4. **Recommendations** – Actionable insights
5. **Rebalancing Suggestion** – Target allocations with reasoning
6. **Agent Chat** – Ask follow-up questions in natural language

---

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### "ANTHROPIC_API_KEY is not configured"
- Check `.env.local` exists and contains a valid key
- Restart the dev server

### Casper address validation fails
- Must start with `01` (66 chars) or `02` (68 chars)
- It is a public key in hex, not an account hash

---

## Learn More

- [Casper AI Toolkit](https://www.casper.network/ai)
- [CSPR.cloud Docs](https://docs.cspr.cloud)
- [Odra Framework](https://odra.dev)
- [Claude API Docs](https://docs.anthropic.com)
- [Next.js Docs](https://nextjs.org/docs)
