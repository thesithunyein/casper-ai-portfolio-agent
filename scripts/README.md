# Deploy scripts

Tooling to deploy the PortfolioAgent Odra contract to Casper Testnet using the
**legacy Deploy (ModuleBytes) path**.

## Why legacy Deploy?

The current Casper 2.0 Testnet runs with **AddressableEntity disabled**. The
newer `casper-client put-transaction session` install path therefore fails with
`ApiError::NotAllowedToAddContractVersion [48]`. These scripts use
`casper-js-sdk`'s `SessionBuilder.buildFor1_5()`, which produces a legacy
`Deploy` that the network accepts today.

## Files

- `deploy-local.mjs` — installs the contract WASM via a signed legacy Deploy.
- `read-package-hash.mjs` — reads the resulting contract package hash from the
  deployer account's named keys.

## Prerequisites

1. **A funded Testnet key** at `keys/secret_key.pem`
   (fund one at https://testnet.cspr.live/tools/faucet).
2. **The contract WASM.** Two ways to get it:
   - **Recommended — CI artifact:** run the *Build Contract* workflow
     (`.github/workflows/build-contract.yml`) on GitHub, download the
     `contract-wasm` artifact, and place it at
     `odra-project/wasm/portfolio_agent_contract.wasm`.
   - **Local build (Linux/macOS, or Windows with VS C++ Build Tools):**
     ```bash
     cd odra-project
     RUSTFLAGS="-C target-cpu=mvp -C link-arg=--allow-undefined -C strip=symbols" \
       cargo build --release -Zbuild-std=panic_abort,std \
       --target wasm32-unknown-unknown --bin portfolio_agent_odra_build_contract
     wasm-opt -Oz --disable-bulk-memory \
       target/wasm32-unknown-unknown/release/portfolio_agent_odra_build_contract.wasm \
       -o wasm/portfolio_agent_contract.wasm
     ```
     > On Windows, the host build scripts require the MSVC linker (`link.exe`).
     > Install "Build Tools for Visual Studio" with the C++ workload, or just
     > use the CI artifact above.

## Usage

```bash
# 1. Deploy
node scripts/deploy-local.mjs

# 2. Read the package hash once the deploy succeeds
node scripts/read-package-hash.mjs

# 3. Set the value in Vercel + .env.local
#    PORTFOLIO_AGENT_PACKAGE_HASH=<hash from step 2>
```

## Environment variables

| Var | Default | Purpose |
|-----|---------|---------|
| `CSPR_TESTNET_PRIVATE_KEY_PEM_PATH` | `keys/secret_key.pem` | Funded deployer key |
| `CSPR_TESTNET_KEY_ALGORITHM` | `ed25519` | `ed25519` or `secp256k1` |
| `PORTFOLIO_AGENT_WASM_PATH` | `odra-project/wasm/portfolio_agent_contract.wasm` | Contract WASM |
| `CASPER_NODE_RPC_URL` | public testnet node | RPC endpoint |
| `DEPLOY_PAYMENT_MOTES` | `300000000000` | Gas payment (300 CSPR) |
| `ODRA_PACKAGE_KEY_NAME` | `portfolio_agent_package_hash` | Named key for the package |

## CI

`.github/workflows/deploy-contract.yml` runs this same flow automatically:
build WASM → write the `CSPR_TESTNET_PRIVATE_KEY` secret to a PEM →
`deploy-local.mjs` → `read-package-hash.mjs`, uploading the deploy hash and
package hash as artifacts.
