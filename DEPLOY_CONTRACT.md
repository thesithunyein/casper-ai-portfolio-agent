# Smart Contract Deployment Guide

## Prerequisites
1. Install Rust: https://rustup.rs
2. Install wasm target: `rustup target add wasm32-unknown-unknown`
3. Get Testnet CSPR from: https://testnet.cspr.live/tools/faucet

## Deploy Steps

```bash
cd odra-project

# Build WASM (CI uses this exact command)
cargo build --release --target wasm32-unknown-unknown

# Generate keys (if needed)
casper-client keygen -f ./keys

# Deploy
casper-client put-deploy \
  --node-address https://node.testnet.casper.network/rpc \
  --chain-name casper-test \
  --secret-key ./keys/secret_key.pem \
  --payment-amount 10000000000 \
  --session-path ./target/wasm32-unknown-unknown/release/portfolio_agent_contract.wasm
```

> Tip: deployment is automated in `.github/workflows/build-and-deploy.yml`.
> Add a funded Testnet key as the `CSPR_TESTNET_PRIVATE_KEY` repo secret and run the workflow.

## After Deployment
1. Save deploy hash from output
2. Check status: https://testnet.cspr.live/deploy/{deploy-hash}
3. Copy contract hash (starts with hash-...)
4. Paste contract hash into README.md under "Contract Address"
