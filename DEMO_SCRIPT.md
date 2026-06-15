# Demo Video Script (60-90 seconds)

## Opening (5s)
"Hi, I'm thesithunyein, and this is my submission for the Casper Agentic Buildathon 2026 — a cute AI portfolio agent for the Casper Network."

## Homepage (10s)
- Show landing page with bear mascot, floating animations, pink theme
- "Most DeFi apps are dark and intimidating. I built something friendly — a cute bear that manages your portfolio."
- Scroll to features section

## Connect Wallet (10s)
- Click "Start Analyzing" button
- Show wallet input (Casper address format 01...)
- Paste a demo address and click "Analyze Portfolio"

## Agent Chat (20s)
- "This isn't just a dashboard — it's a conversational AI agent."
- Type: "What's my risk level?"
- Show agent response with portfolio context
- Type: "Should I buy more CSPR?"
- Show agent's smart response with actionable buttons
- Click "Run Full AI Analysis" action button

## Portfolio Display (10s)
- Show portfolio cards with cute styling, gradient progress bars
- Point out: "Real-time Casper Testnet data via CSPR.cloud API"

## AI Analysis (15s)
- Scroll to AI Analysis cards (Summary, Risk, Recommendations, Rebalancing)
- "Claude AI generates personalized recommendations based on actual portfolio data"
- Point to x402 badge: "And it supports x402 micropayments — agents that pay for their own analysis"

## On-Chain Agentic Loop — THE KEY MOMENT (20s)
- "Here's what makes this agentic: after the AI analyzes, the agent autonomously signs and submits a real Casper 2.0 transaction to store the result on-chain."
- Open the live contract on the explorer:
  https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6
  (deployed PortfolioAgent — show the `store_analysis` entry point)
- Open the install transaction (proof the contract is live):
  https://testnet.cspr.live/transaction/9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a
- Then open the latest `store_analysis` transaction and show `Success` + the stored args (wallet, value, risk, recommendation count, summary hash).
- "No human clicked submit — the agent did. Every analysis is now auditable on-chain."

## Closing (5s)
- Back to homepage
- "Casper AI Portfolio Agent — cute design, real agentic AI, proven on-chain. Vote for us on CSPR.fans!"

## Deployed Contract (for reference while recording)
- Contract Package Hash: `1786b541e2c353accd37cc3c2811a11947e5f4188cdd3da99da011b50795fe50`
- Contract Hash (v1): `0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6`
- Install Txn: `9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a`

## Recording Tips
- Use screen recorder (OBS or Loom)
- Keep cursor visible and move slowly
- Speak clearly, no background music needed
- Upload to YouTube as unlisted or public
