# Smart Contract Deployment Guide (Casper Testnet)

The `PortfolioAgent` contract is built with **Odra 2.7** and deploys to the
Casper **2.0** Testnet. Odra contracts require a set of `odra_cfg_*` install
arguments and are installed with `casper-client put-transaction session`.

## Prerequisites
1. Install Rust: https://rustup.rs and the wasm target:
   `rustup target add wasm32-unknown-unknown`
2. Install `casper-client` **v5** (Casper 2.0): `cargo install casper-client --locked`
3. A **funded** Testnet secret key (`secret_key.pem`). Fund it at
   https://testnet.cspr.live/tools/faucet (the faucet grants enough CSPR for an install).

## 1. Build the WASM

```bash
cd odra-project
cargo build --release --target wasm32-unknown-unknown
# Produces: target/wasm32-unknown-unknown/release/portfolio_agent_contract.wasm
```

(Optionally, `cargo install cargo-odra && cargo odra build -b casper` produces a
size-optimized `wasm/PortfolioAgent.wasm`. Either WASM is deployable.)

## 2. Install the contract

Odra requires these install args (the contract's `init()` takes no extra args):

```bash
casper-client put-transaction session \
  --node-address https://node.testnet.casper.network/rpc \
  --chain-name casper-test \
  --secret-key ./keys/secret_key.pem \
  --payment-amount 300000000000 \
  --gas-price-tolerance 1 \
  --standard-payment true \
  --wasm-path ./odra-project/target/wasm32-unknown-unknown/release/portfolio_agent_contract.wasm \
  --session-arg "odra_cfg_package_hash_key_name:string:'portfolio_agent_package_hash'" \
  --session-arg "odra_cfg_allow_key_override:bool:'true'" \
  --session-arg "odra_cfg_is_upgradable:bool:'true'" \
  --session-arg "odra_cfg_is_upgrade:bool:'false'"
```

- `--payment-amount 300000000000` = 300 CSPR. If the install reverts with an
  out-of-gas error, raise it (a small Odra contract typically installs for
  ~150–300 CSPR on Testnet).
- The command prints a **transaction hash**.

## 3. Record the result

1. Open `https://testnet.cspr.live/transaction/<transaction-hash>` (or
   `/deploy/<hash>`) and confirm it succeeded.
2. The contract package hash is stored under the named key
   `portfolio_agent_package_hash` on the deploying account.
   View it at `https://testnet.cspr.live/account/<your-public-key>`.
3. Put both hashes in `BUIDL_SUBMISSION.md` and set the frontend env var
   `NEXT_PUBLIC_CONTRACT_PACKAGE_HASH=hash-...` so the app can link to the
   on-chain contract.

## Automated deployment (GitHub Actions)

Instead of running locally, add your funded key as the repo secret
`CSPR_TESTNET_PRIVATE_KEY` (the full PEM contents) and run the
**"Deploy Contract to Casper Testnet"** workflow
(`.github/workflows/deploy-contract.yml`) via *Actions → Run workflow*.
It builds the WASM and runs the exact `put-transaction` command above.
