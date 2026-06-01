# Portfolio Agent Smart Contract

## Overview

This Odra smart contract stores AI portfolio analysis results on the Casper Network. It demonstrates agentic AI with on-chain data persistence.

## Contract: PortfolioAgent

### Storage
- `analyses: Mapping<Address, AnalysisResult>` - Portfolio analysis by wallet address
- `total_analyses: Var<u64>` - Counter for total analyses
- `owner: Var<Address>` - Contract owner

### Methods

#### `init()`
Initialize the contract. Sets caller as owner.

#### `store_analysis(wallet_address, total_value, risk_level, recommendation_count, summary_hash)`
Store a portfolio analysis result on-chain.

#### `get_analysis(wallet_address) -> Option<AnalysisResult>`
Retrieve analysis for a specific wallet.

#### `has_analysis(wallet_address) -> bool`
Check if analysis exists.

#### `get_total_analyses() -> u64`
Get total number of analyses.

## Build & Deploy

### Prerequisites
- Rust: https://rustup.rs
- casper-client: `cargo install casper-client`

### Build
```bash
cd contract
cargo odra build
```

### Deploy to Testnet
```bash
cargo odra deploy \
  --network casper-testnet \
  --secret-key <your-secret-key.pem>
```

## Test

```bash
cd contract
cargo odra test
```
