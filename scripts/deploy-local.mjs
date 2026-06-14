/**
 * Local Casper Testnet deploy for the PortfolioAgent Odra contract.
 *
 * Uses the LEGACY Deploy (ModuleBytes session) path via casper-js-sdk's
 * SessionBuilder.buildFor1_5(). The current Casper 2.0 Testnet runs with
 * AddressableEntity DISABLED, which is why `casper-client put-transaction
 * session` returns ApiError::NotAllowedToAddContractVersion [48]. The legacy
 * Deploy install path is what the network actually accepts today.
 *
 * Usage (PowerShell):
 *   $env:CSPR_TESTNET_PRIVATE_KEY_PEM_PATH="keys/secret_key.pem"
 *   node scripts/deploy-local.mjs
 *
 * Env vars:
 *   CSPR_TESTNET_PRIVATE_KEY_PEM_PATH  Path to funded secret_key.pem (default: keys/secret_key.pem)
 *   CSPR_TESTNET_KEY_ALGORITHM         'ed25519' (default) or 'secp256k1'
 *   PORTFOLIO_AGENT_WASM_PATH          Path to the contract WASM
 *                                      (default: odra-project/wasm/portfolio_agent_contract.wasm)
 *   CASPER_NODE_RPC_URL                RPC node (default public testnet node)
 *   DEPLOY_PAYMENT_MOTES               Gas payment (default 300000000000 = 300 CSPR)
 *   ODRA_PACKAGE_KEY_NAME              Named key for the package hash
 *                                      (default: portfolio_agent_package_hash)
 */

import fs from 'node:fs'
import path from 'node:path'
import casperSdk from 'casper-js-sdk'

const {
  Args,
  CLValue,
  Deploy,
  KeyAlgorithm,
  PrivateKey,
  SessionBuilder,
} = casperSdk

const CHAIN_NAME = 'casper-test'
const RPC_URL =
  process.env.CASPER_NODE_RPC_URL || 'https://node.testnet.casper.network/rpc'
const EXPLORER = 'https://testnet.cspr.live'

const PEM_PATH =
  process.env.CSPR_TESTNET_PRIVATE_KEY_PEM_PATH || 'keys/secret_key.pem'
const WASM_PATH =
  process.env.PORTFOLIO_AGENT_WASM_PATH ||
  'odra-project/wasm/portfolio_agent_contract.wasm'
const PAYMENT_MOTES = process.env.DEPLOY_PAYMENT_MOTES || '300000000000'
const PACKAGE_KEY_NAME =
  process.env.ODRA_PACKAGE_KEY_NAME || 'portfolio_agent_package_hash'

const ALGO =
  (process.env.CSPR_TESTNET_KEY_ALGORITHM || 'ed25519').toLowerCase() ===
  'secp256k1'
    ? KeyAlgorithm.SECP256K1
    : KeyAlgorithm.ED25519

function die(msg) {
  console.error(`\nERROR: ${msg}\n`)
  process.exit(1)
}

async function rpcCall(method, params) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  })
  const json = await res.json()
  if (json.error) {
    throw new Error(`RPC ${method} failed: ${JSON.stringify(json.error)}`)
  }
  return json.result
}

function loadKey() {
  const resolved = path.resolve(PEM_PATH)
  if (!fs.existsSync(resolved)) {
    die(
      `Funded key not found at ${resolved}.\n` +
        `Provide it via CSPR_TESTNET_PRIVATE_KEY_PEM_PATH or place it at keys/secret_key.pem.\n` +
        `Fund a Testnet key at ${EXPLORER}/tools/faucet`
    )
  }
  const pem = fs.readFileSync(resolved, 'utf-8')
  // Try the configured algorithm first, then the other one. Casper keys may be
  // ed25519 (public key prefix 01) or secp256k1 (prefix 02); auto-detect so the
  // deploy works regardless of which the funded account uses.
  const candidates =
    ALGO === KeyAlgorithm.SECP256K1
      ? [KeyAlgorithm.SECP256K1, KeyAlgorithm.ED25519]
      : [KeyAlgorithm.ED25519, KeyAlgorithm.SECP256K1]
  const errors = []
  for (const algo of candidates) {
    try {
      const key = PrivateKey.fromPem(pem, algo)
      const algoName = algo === KeyAlgorithm.SECP256K1 ? 'secp256k1' : 'ed25519'
      console.log(`Parsed key as ${algoName}`)
      return key
    } catch (e) {
      errors.push(`${algo === KeyAlgorithm.SECP256K1 ? 'secp256k1' : 'ed25519'}: ${e.message}`)
    }
  }
  die(`Failed to parse PEM with either algorithm.\n  ${errors.join('\n  ')}`)
}

function loadWasm() {
  const resolved = path.resolve(WASM_PATH)
  if (!fs.existsSync(resolved)) {
    die(
      `Contract WASM not found at ${resolved}.\n` +
        `Build it first (see scripts/README.md) or set PORTFOLIO_AGENT_WASM_PATH.`
    )
  }
  return new Uint8Array(fs.readFileSync(resolved))
}

async function main() {
  console.log('=== PortfolioAgent legacy Testnet deploy ===')
  console.log(`RPC:      ${RPC_URL}`)
  console.log(`WASM:     ${WASM_PATH}`)
  console.log(`Key:      ${PEM_PATH} (${ALGO})`)
  console.log(`Payment:  ${PAYMENT_MOTES} motes`)
  console.log(`Pkg key:  ${PACKAGE_KEY_NAME}`)

  const key = loadKey()
  const wasm = loadWasm()
  console.log(`\nDeployer public key: ${key.publicKey.toHex()}`)
  console.log(`WASM size: ${wasm.length} bytes`)

  // Odra install args. allow_key_override=false forces a fresh package;
  // is_upgradable=true keeps the package unlocked for future versions.
  const args = Args.fromMap({
    odra_cfg_package_hash_key_name: CLValue.newCLString(PACKAGE_KEY_NAME),
    odra_cfg_allow_key_override: CLValue.newCLValueBool(false),
    odra_cfg_is_upgradable: CLValue.newCLValueBool(true),
  })

  const deploy = new SessionBuilder()
    .from(key.publicKey)
    .chainName(CHAIN_NAME)
    .wasm(wasm)
    .installOrUpgrade()
    .runtimeArgs(args)
    .payment(Number(PAYMENT_MOTES))
    .buildFor1_5()

  deploy.sign(key)

  // Serialize the Deploy directly (Deploy.toJSON) and submit via raw JSON-RPC.
  // The SDK's RpcClient.putDeploy() has a typedjson bug serializing the
  // PutDeployRequest wrapper ("Could not serialize 'deploy'"), so we bypass it.
  const deployJson = Deploy.toJSON(deploy)

  console.log('\nSubmitting deploy (account_put_deploy)...')
  const putResult = await rpcCall('account_put_deploy', { deploy: deployJson })
  const deployHash =
    putResult?.deploy_hash || putResult?.deployHash || deploy.hash?.toHex?.()
  if (!deployHash) {
    die(`No deploy hash returned. Response: ${JSON.stringify(putResult)}`)
  }
  console.log(`\nDeploy submitted!`)
  console.log(`Deploy hash: ${deployHash}`)
  console.log(`Explorer:    ${EXPLORER}/deploy/${deployHash}`)

  console.log('\nWaiting for execution (up to ~3 min)...')
  const start = Date.now()
  while (Date.now() - start < 180_000) {
    await new Promise((r) => setTimeout(r, 8000))
    let info
    try {
      info = await rpcCall('info_get_deploy', { deploy_hash: deployHash })
    } catch {
      process.stdout.write('.')
      continue
    }

    const exec = info?.execution_info || info?.execution_results
    const result =
      info?.execution_info?.execution_result ||
      (Array.isArray(info?.execution_results)
        ? info.execution_results[0]?.result
        : undefined)
    if (!exec || !result) {
      process.stdout.write('.')
      continue
    }

    // Casper 2.0 (Version2) or legacy (Success/Failure) shapes
    const v2 = result.Version2 || result
    const failure =
      result.Failure || (v2?.error_message ? { error_message: v2.error_message } : null)
    const success = result.Success || (!failure && (v2?.cost != null || v2?.consumed != null))

    if (failure) {
      console.error('\n=== DEPLOY FAILED ON-CHAIN ===')
      console.error(`Error: ${failure.error_message || JSON.stringify(failure)}`)
      console.error(`Explorer: ${EXPLORER}/deploy/${deployHash}`)
      process.exit(1)
    }
    if (success) {
      console.log('\n\n=== DEPLOY SUCCEEDED ===')
      console.log(`Deploy hash:   ${deployHash}`)
      console.log(`Deploy link:   ${EXPLORER}/deploy/${deployHash}`)
      console.log(`\nContract package stored under named key '${PACKAGE_KEY_NAME}'`)
      console.log(`Account:       ${EXPLORER}/account/${key.publicKey.toHex()}`)
      console.log(
        `\nNext: run 'node scripts/read-package-hash.mjs' to fetch the package hash,`
      )
      console.log(`then set PORTFOLIO_AGENT_PACKAGE_HASH in Vercel + .env.local.`)
      return
    }
    process.stdout.write('.')
  }
  console.log(
    `\nTimed out waiting. Check status: ${EXPLORER}/deploy/${deployHash}`
  )
}

main().catch((e) => die(e?.stack || e?.message || String(e)))
