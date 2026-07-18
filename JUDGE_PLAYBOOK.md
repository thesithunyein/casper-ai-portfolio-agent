# Judge Playbook — Casper AI Portfolio Agent

Same product as the [live app](https://casper-ai-portfolio-agent.vercel.app) and root [README.md](./README.md).

## 60-second path

1. Open https://casper-ai-portfolio-agent.vercel.app  
2. Sticky **Judges** bar → **Try demo** (or Connect → **Try with Demo Account**)  
3. **Analyze Portfolio**  
4. Verify activity log: portfolio → RWA → **x402 settle** → AI → `store_analysis`  
5. Click tx hashes → `testnet.cspr.live` shows **Success**  
6. Confirm **Agent Identity**, **Agent Reputation**, Multi-Agent, Yield Routing  
7. Optional: `/api/agent-status`

## On-chain artifacts

| Artifact | Value |
|---|---|
| Package hash | `2f76596281bab4993440f5bd88728a34faa1031ab4b7ce8e0064219e1ae2e03d` |
| Contract | https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6 |
| Sample `store_analysis` | https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779 |
| Install tx | https://testnet.cspr.live/transaction/9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a |

## Working definition

- Transaction-producing component: Odra `PortfolioAgent.store_analysis`  
- Agentic loop: AI decides → agent wallet signs → Testnet confirms  
- x402: real settle (facilitator or agent-wallet 0.01 CSPR) when configured  
- RWA: live Treasury.gov + CoinGecko feeds  

## Demo recording

Record a 75–90s walkthrough: Judges bar → Try demo → Analyze → click x402 + `store_analysis` explorer links → Identity + Reputation. Upload to YouTube and link it on the DoraHacks BUIDL page.
