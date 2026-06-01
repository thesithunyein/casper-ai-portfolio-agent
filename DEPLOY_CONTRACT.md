# Smart Contract Deployment Guide

## Prerequisites
1. Install Rust: https://rustup.rs
2. Install wasm target: `rustup target add wasm32-unknown-unknown`
3. Get Testnet CSPR from: https://testnet.cspr.live/tools/faucet

## Deploy Steps

```bash
cd contract

# Install Odra
cargo install cargo-odra

# Build WASM
cargo odra build

# Generate keys (if needed)
casper-client keygen -f ./keys

# Deploy
casper-client put-deploy \
  --node-address http://188.40.120.12:7777/rpc \
  --chain-name casper-testnet \
  --secret-key ./keys/secret_key.pem \
  --payment-amount 10000000000 \
  --session-path ./target/wasm32-unknown-unknown/release/portfolio_agent_contract.wasm
```

## After Deployment
1. Save deploy hash from output
2. Check status: https://testnet.cspr.live/deploy/{deploy-hash}
3. Copy contract hash (starts with hash-...)
4. Paste contract hash into README.md under "Contract Address"
