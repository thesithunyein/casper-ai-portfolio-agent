# Portfolio Agent Odra Contract

Casper smart contract for storing AI portfolio analysis results.

## Build

```bash
# Build the contract
cargo build --release --target wasm32-unknown-unknown

# Or using Odra CLI (recommended)
cargo odra build
```

## Deploy

```bash
casper-client put-deploy \
  --node-address http://188.40.120.12:7777/rpc \
  --chain-name casper-testnet \
  --secret-key ./keys/secret_key.pem \
  --payment-amount 10000000000 \
  --session-path ./target/wasm32-unknown-unknown/release/portfolio_agent_contract.wasm
```

## Contract Methods

- `init()` - Initialize the contract
- `store_analysis(address, value, risk, count, hash)` - Store analysis result
- `get_analysis(address)` - Retrieve analysis for a wallet
- `has_analysis(address)` - Check if analysis exists
- `get_total_analyses()` - Get total analysis count
- `get_owner()` - Get contract owner
