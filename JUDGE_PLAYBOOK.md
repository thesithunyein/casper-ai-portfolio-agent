# Judge Playbook — CasperAgent

Same product as the [live app](https://casper-ai-portfolio-agent.vercel.app) and root [README.md](./README.md).

## 60-second path

1. Open https://casper-ai-portfolio-agent.vercel.app  
2. **Try demo** (or enter a public key → **Connect & Analyze**)  
3. Stay on **Agent running** until results load  
4. On results, click **x402** / **On-chain** chips → `testnet.cspr.live` shows **Success**  
5. Skim holdings, insight, and **Built On Casper Network**  
6. Optional: `/api/agent-status` · home Essentials → **Contract** / **Verify**

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
- x402: real settle (facilitator or agent-wallet) when configured  
- RWA: live Treasury.gov + CoinGecko feeds  

## Demo recording tip

Record ~75–90s: home → Try demo → Agent running → results → click explorer proofs → Built On Casper. Upload to YouTube and link on the DoraHacks BUIDL page.
