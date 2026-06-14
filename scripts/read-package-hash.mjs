/**
 * Reads the PortfolioAgent contract package hash from the deployer account's
 * named keys after a successful deploy.
 *
 * Usage (PowerShell):
 *   node scripts/read-package-hash.mjs <public_key_hex>
 *   # or rely on the funded key:
 *   node scripts/read-package-hash.mjs
 *
 * Prints the package hash and the value to put in PORTFOLIO_AGENT_PACKAGE_HASH.
 */

import fs from 'node:fs'
import path from 'node:path'
import { PrivateKey, KeyAlgorithm } from 'casper-js-sdk'

const RPC_URL =
  process.env.CASPER_NODE_RPC_URL || 'https://node.testnet.casper.network/rpc'
const EXPLORER = 'https://testnet.cspr.live'
const PACKAGE_KEY_NAME =
  process.env.ODRA_PACKAGE_KEY_NAME || 'portfolio_agent_package_hash'
const PEM_PATH =
  process.env.CSPR_TESTNET_PRIVATE_KEY_PEM_PATH || 'keys/secret_key.pem'
const ALGO =
  (process.env.CSPR_TESTNET_KEY_ALGORITHM || 'ed25519').toLowerCase() ===
  'secp256k1'
    ? KeyAlgorithm.SECP256K1
    : KeyAlgorithm.ED25519

function resolvePublicKey() {
  const arg = process.argv[2]
  if (arg) return arg.trim()
  const resolved = path.resolve(PEM_PATH)
  if (!fs.existsSync(resolved)) {
    console.error(
      `Provide a public key hex arg, or place a funded key at ${PEM_PATH}.`
    )
    process.exit(1)
  }
  const key = PrivateKey.fromPem(fs.readFileSync(resolved, 'utf-8'), ALGO)
  return key.publicKey.toHex()
}

async function rpc(method, params) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  })
  const json = await res.json()
  if (json.error) throw new Error(JSON.stringify(json.error))
  return json.result
}

async function main() {
  const publicKey = resolvePublicKey()
  console.log(`Account public key: ${publicKey}`)

  // Casper 2.0: query the addressable entity / account named keys.
  const entity = await rpc('state_get_entity', {
    entity_identifier: { PublicKey: publicKey },
  })

  const namedKeys =
    entity?.entity?.named_keys ||
    entity?.entity?.Account?.named_keys ||
    entity?.named_keys ||
    []

  if (!Array.isArray(namedKeys) || namedKeys.length === 0) {
    console.error(
      '\nNo named keys found on this account. The deploy may not have ' +
        'succeeded yet. Re-run scripts/deploy-local.mjs and confirm success.'
    )
    process.exit(1)
  }

  console.log('\nNamed keys on account:')
  for (const nk of namedKeys) {
    console.log(`  ${nk.name} -> ${nk.key}`)
  }

  const match = namedKeys.find(
    (nk) =>
      nk.name === PACKAGE_KEY_NAME ||
      nk.name?.includes('portfolio_agent') ||
      nk.name?.includes('package_hash')
  )

  if (!match) {
    console.error(
      `\nCould not find a named key matching '${PACKAGE_KEY_NAME}'. ` +
        `Inspect the list above and set PORTFOLIO_AGENT_PACKAGE_HASH manually.`
    )
    process.exit(1)
  }

  const raw = match.key
  const hash = raw.replace(/^(hash-|package-|contract-package-)/, '')
  console.log('\n=== CONTRACT PACKAGE HASH ===')
  console.log(`Named key:    ${match.name}`)
  console.log(`Raw key:      ${raw}`)
  console.log(`Package hash: ${hash}`)
  console.log(`Explorer:     ${EXPLORER}/contract-package/${hash}`)
  console.log('\nSet this in Vercel + .env.local:')
  console.log(`PORTFOLIO_AGENT_PACKAGE_HASH=${hash}`)
}

main().catch((e) => {
  console.error(`ERROR: ${e?.message || e}`)
  process.exit(1)
})
