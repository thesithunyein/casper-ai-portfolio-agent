# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> Mobile Layout >> theme toggle should be visible on mobile
- Location: e2e\landing-page.spec.ts:73:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[aria-label="Toggle theme"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button[aria-label="Toggle theme"]')

```

```yaml
- main:
  - navigation:
    - text: Casper Agent
    - button "Toggle theme"
    - button "Connect"
  - text: Casper Agentic Buildathon 2026
  - heading "Autonomous portfolio management, powered by AI" [level=1]
  - paragraph: AI-powered analysis with autonomous on-chain rebalancing. The agent reads your portfolio, checks RWA prices, and acts — all on Casper Testnet.
  - paragraph: Supports CSPR, stablecoins, and RWA token analysis — including live US T-bill yields and tokenized gold (PAXG).
  - button "Start Analyzing"
  - link "View contract →":
    - /url: https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6
  - text: Live on Testnet
  - link "Proof of write →":
    - /url: https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779
  - text: agent.log _
  - paragraph: 14:32:01 INFO Portfolio fetch initiated
  - paragraph: 14:32:02 INFO Connected to CSPR.cloud API
  - paragraph: "14:32:02 INFO RWA oracle: TBILL $99.87, XAU $2,345.60"
  - paragraph: 14:32:03 WARN CSPR concentration 78% — above threshold
  - paragraph: "14:32:04 INFO AI analysis: OpenAI GPT-4o"
  - paragraph: 14:32:05 OK store_analysis recorded on-chain
  - paragraph: 14:32:06 ACT Autonomous rebalance executed
  - paragraph: "14:32:07 OK Native transfer: 1 CSPR → user"
  - paragraph: _
  - heading "Capabilities" [level=2]
  - paragraph: What the agent does on your behalf.
  - text: AI
  - heading "Portfolio Analysis" [level=3]
  - paragraph: OpenAI GPT-4o analyzes holdings and generates risk assessments in real-time.
  - text: AG
  - heading "Agent Chat" [level=3]
  - paragraph: Conversational interface for portfolio queries and agent-directed actions.
  - text: $0
  - heading "x402 Micropayments" [level=3]
  - paragraph: Agent pays per-analysis fees via Casper's x402 payment protocol.
  - text: CH
  - heading "On-Chain Storage" [level=3]
  - paragraph: Analysis records persisted to Casper Testnet via Odra smart contract.
  - text: RWA
  - heading "RWA Intelligence" [level=3]
  - paragraph: Live US T-bill yields, tokenized gold, and ONDO prices integrated into AI rebalancing.
  - heading "How It Works" [level=2]
  - paragraph: Four steps from connection to autonomous action.
  - text: "01"
  - heading "Connect Wallet" [level=3]
  - paragraph: Use Casper Wallet extension or enter your public key manually. No private keys ever required.
  - text: "02"
  - heading "Fetch Balances" [level=3]
  - paragraph: Real-time portfolio data pulled from CSPR.cloud API across all your token holdings.
  - text: "03"
  - heading "AI Analysis" [level=3]
  - paragraph: GPT-4o generates a complete risk profile and rebalancing suggestions tailored to your allocation.
  - text: "04"
  - heading "On-Chain Action" [level=3]
  - paragraph: Agent records analysis to the Odra contract and optionally executes autonomous rebalancing transfers.
  - heading "FAQ" [level=2]
  - paragraph: Common questions about the Casper AI Portfolio Agent.
  - group: Is this safe? Do you store my private keys? ▼
  - group: What is x402 and why does the agent pay for analysis? ▼
  - group: What does "autonomous rebalancing" mean? ▼
  - group: Which wallet do I need? ▼
  - group: Is this on mainnet or testnet? ▼
  - heading "Live RWA Intelligence" [level=2]
  - paragraph: Real-world asset data factored into every AI rebalancing decision
  - img
  - paragraph: US Treasury T-bill
  - text: Live
  - img
  - paragraph: PAX Gold (PAXG)
  - text: Live
  - img
  - paragraph: Ondo Finance (ONDO)
  - text: Live
  - paragraph: These yields are factored into AI rebalancing when CSPR concentration exceeds 70%
  - heading "Documentation" [level=2]
  - paragraph: Everything you need to understand and extend the agent.
  - link "Testnet Smart Contract Odra-based contract deployed on Casper Testnet. Stores analysis hashes and autonomous action records.":
    - /url: https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6
    - text: Testnet
    - img
    - heading "Smart Contract" [level=3]
    - paragraph: Odra-based contract deployed on Casper Testnet. Stores analysis hashes and autonomous action records.
  - link "Planned Roadmap Q3 2026 Mainnet, Q4 2026 RWA oracle + CEP-18, Q1 2027 Mobile PWA + DAO governance.":
    - /url: https://github.com/thesithunyein/casper-ai-portfolio-agent#roadmap--launch-plans
    - text: Planned
    - img
    - heading "Roadmap" [level=3]
    - paragraph: Q3 2026 Mainnet, Q4 2026 RWA oracle + CEP-18, Q1 2027 Mobile PWA + DAO governance.
  - link "Open Source GitHub Repository Full source code including frontend, AI agents, x402 integration, and Odra smart contracts.":
    - /url: https://github.com/thesithunyein/casper-ai-portfolio-agent
    - text: Open Source
    - img
    - heading "GitHub Repository" [level=3]
    - paragraph: Full source code including frontend, AI agents, x402 integration, and Odra smart contracts.
  - heading "Roadmap" [level=2]
  - paragraph: Where we are headed — from hackathon MVP to a full agentic portfolio mesh.
  - img
  - text: Q2 2026 Shipped
  - heading "MVP on Casper Testnet" [level=3]
  - paragraph: Portfolio analysis, x402 micropayments, Odra smart contract, and autonomous rebalancing.
  - img
  - text: Q3 2026 In Progress
  - heading "RWA Oracle Integration" [level=3]
  - paragraph: Tokenized T-bills, gold, and equities priced on-chain for true diversification advice.
  - img
  - text: Q3 2026 Planned
  - heading "Live x402 Facilitator" [level=3]
  - paragraph: Real micropayment settlement on Casper Mainnet via the official x402 facilitator.
  - img
  - text: Q4 2026 Planned
  - heading "Mainnet Deployment" [level=3]
  - paragraph: Full production launch with audited Odra contracts and institutional-grade security.
  - img
  - text: Q1 2027 Planned
  - heading "Multi-Agent Mesh" [level=3]
  - paragraph: Multiple specialized agents (yield, risk, macro) coordinating via x402 payments.
  - heading "Connect Wallet" [level=2]
  - paragraph: Link your Casper wallet to get AI-powered portfolio analysis and autonomous rebalancing.
  - img
  - heading "Connect Your Wallet" [level=2]
  - paragraph: Enter your Casper public key to analyze your portfolio
  - text: Public Key
  - textbox "01abc... (66-68 characters)"
  - button "Analyze Portfolio"
  - text: or try demo
  - button "Try with Demo Account"
  - link "Need testnet CSPR? Get tokens from the faucet →":
    - /url: https://testnet.cspr.live/tools/faucet
  - text: AI-Powered Casper Testnet x402 Ready
  - paragraph: Casper AI Portfolio Agent
  - paragraph: Built for the Casper Agentic Buildathon 2026
  - link "X / Twitter":
    - /url: https://x.com/CasperAgentAI
    - img
    - text: X / Twitter
  - link "Telegram":
    - /url: https://t.me/casperagent
    - img
    - text: Telegram
  - link "GitHub":
    - /url: https://github.com/thesithunyein/casper-ai-portfolio-agent
    - img
    - text: GitHub
  - text: Testnet Live x402 Ready
  - link "Contract":
    - /url: https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6
  - text: "|"
  - link "Proof of Write":
    - /url: https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Landing Page', () => {
  4  |   test('should load homepage with hero section', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await expect(page.locator('h1')).toBeVisible()
  7  |     await expect(page.locator('text=Autonomous portfolio management')).toBeVisible()
  8  |   })
  9  | 
  10 |   test('should display buildathon badge', async ({ page }) => {
  11 |     await page.goto('/')
  12 |     await expect(page.getByText('Casper Agentic Buildathon 2026', { exact: true })).toBeVisible()
  13 |   })
  14 | 
  15 |   test('should have working nav links', async ({ page, isMobile }) => {
  16 |     await page.goto('/')
  17 |     if (isMobile) {
  18 |       // Nav links are hidden on mobile (hidden sm:block)
  19 |       await expect(page.locator('a[href="#features"]')).toBeHidden()
  20 |     } else {
  21 |       await expect(page.locator('a[href="#features"]')).toBeVisible()
  22 |       await expect(page.locator('a[href="#how-it-works"]')).toBeVisible()
  23 |       await expect(page.locator('a[href="#roadmap"]')).toBeVisible()
  24 |     }
  25 |   })
  26 | 
  27 |   test('should have Connect button', async ({ page }) => {
  28 |     await page.goto('/')
  29 |     const connectBtn = page.locator('button:has-text("Connect")')
  30 |     await expect(connectBtn).toBeVisible()
  31 |   })
  32 | 
  33 |   test('should have theme toggle button', async ({ page }) => {
  34 |     await page.goto('/')
  35 |     const themeBtn = page.locator('button[aria-label="Toggle theme"]')
  36 |     await expect(themeBtn).toBeVisible()
  37 |   })
  38 | 
  39 |   test('should toggle dark mode', async ({ page }) => {
  40 |     await page.goto('/')
  41 |     const themeBtn = page.locator('button[aria-label="Toggle theme"]')
  42 |     await themeBtn.click()
  43 |     // After clicking, the html should have dark class
  44 |     await expect(page.locator('html')).toHaveClass(/dark/)
  45 |   })
  46 | 
  47 |   test('should display token ticker bar', async ({ page }) => {
  48 |     await page.goto('/')
  49 |     // Token ticker should be visible below nav
  50 |     const ticker = page.locator('[class*="overflow-hidden"]').first()
  51 |     await expect(ticker).toBeVisible()
  52 |   })
  53 | 
  54 |   test('should scroll to wallet section on Connect click', async ({ page }) => {
  55 |     await page.goto('/')
  56 |     await page.locator('button:has-text("Connect")').click()
  57 |     await page.waitForTimeout(1000)
  58 |     const walletSection = page.locator('#wallet-section')
  59 |     await expect(walletSection).toBeVisible()
  60 |   })
  61 | })
  62 | 
  63 | test.describe('Mobile Layout', () => {
  64 |   test('should be responsive on mobile viewport', async ({ page }) => {
  65 |     await page.setViewportSize({ width: 375, height: 812 })
  66 |     await page.goto('/')
  67 |     await expect(page.locator('h1')).toBeVisible()
  68 |     // Nav links should be hidden on mobile
  69 |     const navLinks = page.locator('a[href="#features"]')
  70 |     await expect(navLinks).toBeHidden()
  71 |   })
  72 | 
  73 |   test('theme toggle should be visible on mobile', async ({ page }) => {
  74 |     await page.setViewportSize({ width: 375, height: 812 })
  75 |     await page.goto('/')
  76 |     const themeBtn = page.locator('button[aria-label="Toggle theme"]')
> 77 |     await expect(themeBtn).toBeVisible()
     |                            ^ Error: expect(locator).toBeVisible() failed
  78 |   })
  79 | 
  80 |   test('Connect button should be visible on mobile', async ({ page }) => {
  81 |     await page.setViewportSize({ width: 375, height: 812 })
  82 |     await page.goto('/')
  83 |     const connectBtn = page.locator('button:has-text("Connect")')
  84 |     await expect(connectBtn).toBeVisible()
  85 |   })
  86 | })
  87 | 
```