/**
 * Server-side Casper agent: writes AI analysis results on-chain by calling the
 * PortfolioAgent Odra contract's `store_analysis` entry point on Casper Testnet.
 *
 * This closes the agentic loop: AI analyzes -> agent signs & submits a real
 * Casper 2.0 transaction -> the analysis record is auditable on-chain.
 *
 * Required env (server only, never exposed to the client):
 * - CASPER_AGENT_PRIVATE_KEY_PEM  (or CASPER_AGENT_PRIVATE_KEY_HEX)
 * - PORTFOLIO_AGENT_PACKAGE_HASH  (contract package hash from the deploy)
 * Optional:
 * - CASPER_AGENT_KEY_ALGORITHM    ('ed25519' default, or 'secp256k1')
 */

import { createHash } from 'crypto'
import {
  Args,
  CLValue,
  ContractCallBuilder,
  HttpHandler,
  KeyAlgorithm,
  PrivateKey,
  PublicKey,
  RpcClient,
  NativeTransferBuilder,
} from 'casper-js-sdk'
import {
  CASPER_CHAIN_NAME,
  CASPER_NODE_RPC_URL,
  getTransactionExplorerUrl,
} from './casper'

export interface OnChainRecord {
  /** Hex hash of the submitted Casper transaction */
  transactionHash: string
  /** testnet.cspr.live link to the transaction */
  explorerUrl: string
  /** Contract package hash that was called */
  contractPackageHash: string
  network: string
  entryPoint: string
}

/** Gas budget for a store_analysis call (motes). 10 CSPR gives comfortable headroom. */
const STORE_ANALYSIS_PAYMENT_MOTES = Number(
  process.env.STORE_ANALYSIS_PAYMENT_MOTES || 10_000_000_000
)

/**
 * Gas price tolerance for PaymentLimited pricing. Casper testnet/mainnet
 * chainspec currently sets max_gas_price = 1 — values above that are rejected
 * as "invalid pricing mode" (-32016 Invalid transaction).
 */
const GAS_PRICE_TOLERANCE = Number(process.env.CASPER_GAS_PRICE_TOLERANCE || 1)

const normalizeHash = (hash: string): string =>
  hash.replace(/^(hash-|contract-package-wasm|contract-package-)/, '')

/** Pull the useful `data` field from Casper JSON-RPC -32016 errors. */
const formatRpcError = (error: unknown): string => {
  if (!error || typeof error !== 'object') return String(error)
  const err = error as {
    message?: string
    data?: unknown
    sourceErr?: { message?: string; data?: unknown }
    cause?: { message?: string; data?: unknown }
  }
  const message = err.message || 'Unknown RPC error'
  const data = err.sourceErr?.data ?? err.data ?? err.cause?.data
  if (data == null) return message
  const detail = typeof data === 'string' ? data : JSON.stringify(data)
  return detail && !message.includes(detail) ? `${message}: ${detail}` : message
}

const loadAgentPrivateKey = (): PrivateKey | null => {
  const pem = process.env.CASPER_AGENT_PRIVATE_KEY_PEM
  const hex = process.env.CASPER_AGENT_PRIVATE_KEY_HEX
  const algorithm =
    (process.env.CASPER_AGENT_KEY_ALGORITHM || 'ed25519').toLowerCase() ===
    'secp256k1'
      ? KeyAlgorithm.SECP256K1
      : KeyAlgorithm.ED25519

  try {
    if (pem) {
      // Support PEMs pasted into env vars with literal \n sequences
      return PrivateKey.fromPem(pem.replace(/\\n/g, '\n'), algorithm)
    }
    if (hex) {
      return PrivateKey.fromHex(hex.trim(), algorithm)
    }
  } catch (error) {
    console.error('Failed to load Casper agent key:', error)
  }
  return null
}

/** True when the agent has a key and contract hash configured. */
export const isOnChainRecordingConfigured = (): boolean =>
  Boolean(
    (process.env.CASPER_AGENT_PRIVATE_KEY_PEM ||
      process.env.CASPER_AGENT_PRIVATE_KEY_HEX) &&
      process.env.PORTFOLIO_AGENT_PACKAGE_HASH
  )

/** SHA-256 content hash of the full analysis, stored on-chain for audit. */
export const hashAnalysisSummary = (analysis: unknown): string =>
  createHash('sha256').update(JSON.stringify(analysis)).digest('hex')

/** Whether autonomous rebalancing is enabled via env. */
export const isAutonomousRebalanceEnabled = (): boolean =>
  process.env.ENABLE_AUTONOMOUS_REBALANCE === '1' ||
  process.env.ENABLE_AUTONOMOUS_REBALANCE === 'true'

/**
 * Native transfer floor on casper-test (chainspec native_transfer_minimum_motes).
 * Below this, put_transaction returns Invalid transaction.
 */
const NATIVE_TRANSFER_MINIMUM_MOTES = 2_500_000_000

/** Autonomous rebalance demo transfer — must meet native transfer minimum. */
const REBALANCE_AMOUNT_MOTES = Number(
  process.env.REBALANCE_AMOUNT_MOTES || NATIVE_TRANSFER_MINIMUM_MOTES
)

/**
 * Agent-wallet x402 settle amount in motes. Intent headers may still say 0.01;
 * on-chain native settle must be >= native_transfer_minimum_motes (2.5 CSPR).
 */
const X402_MICROPAYMENT_MOTES = Number(
  process.env.X402_MICROPAYMENT_MOTES || NATIVE_TRANSFER_MINIMUM_MOTES
)

/**
 * Real on-chain x402-style micropayment via agent-wallet native transfer.
 * Amount defaults to chainspec native_transfer_minimum_motes (2.5 CSPR) so
 * put_transaction is accepted. Produces a verifiable Testnet transaction.
 */
export const executeX402Micropayment = async (
  recipientAddress?: string
): Promise<{ transactionHash: string; explorerUrl: string; amountCspr: string } | null> => {
  const privateKey = loadAgentPrivateKey()
  if (!privateKey) return null

  const targetHex =
    recipientAddress ||
    process.env.NEXT_PUBLIC_X402_RECIPIENT ||
    privateKey.publicKey.toHex()

  const MAX_ATTEMPTS = 3
  let lastError: string | null = null

  const amountCspr = (X402_MICROPAYMENT_MOTES / 1_000_000_000).toFixed(2)

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const targetPublicKey = PublicKey.fromHex(targetHex)
      const transaction = new NativeTransferBuilder()
        .from(privateKey.publicKey)
        .target(targetPublicKey)
        .amount(String(X402_MICROPAYMENT_MOTES))
        .id(Date.now())
        .chainName(CASPER_CHAIN_NAME)
        .payment(STORE_ANALYSIS_PAYMENT_MOTES, GAS_PRICE_TOLERANCE)
        .build()

      transaction.sign(privateKey)

      const rpcClient = new RpcClient(new HttpHandler(CASPER_NODE_RPC_URL))
      const result = await rpcClient.putTransaction(transaction)
      const transactionHash = result.transactionHash.toHex()

      console.log('x402 micropayment tx:', transactionHash)

      return {
        transactionHash,
        explorerUrl: getTransactionExplorerUrl(transactionHash),
        amountCspr,
      }
    } catch (error) {
      lastError = formatRpcError(error)
      console.error(
        `x402 micropayment failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
        lastError
      )
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 600))
      }
    }
  }

  console.error('x402 micropayment ultimately failed:', lastError)
  return null
}

/**
 * Autonomous on-chain action: transfer a small amount of CSPR to a
 * configured vault (or back to the user wallet) when the AI recommends
 * rebalancing. This produces a real Casper transaction signed by the agent,
 * proving the agent doesn't just analyze — it *acts* on-chain.
 *
 * Returns the transaction record, or null when not configured.
 */
export const executeAutonomousRebalance = async (
  targetAddress: string,
  note: string = 'AI rebalancing action'
): Promise<{ transactionHash: string; explorerUrl: string } | null> => {
  const privateKey = loadAgentPrivateKey()
  if (!privateKey) return null

  const MAX_ATTEMPTS = 3
  let lastError: string | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const targetPublicKey = PublicKey.fromHex(targetAddress)
      const transaction = new NativeTransferBuilder()
        .from(privateKey.publicKey)
        .target(targetPublicKey)
        .amount(String(REBALANCE_AMOUNT_MOTES))
        .id(Date.now())
        .chainName(CASPER_CHAIN_NAME)
        .payment(STORE_ANALYSIS_PAYMENT_MOTES, GAS_PRICE_TOLERANCE)
        .build()

      transaction.sign(privateKey)

      const rpcClient = new RpcClient(new HttpHandler(CASPER_NODE_RPC_URL))
      const result = await rpcClient.putTransaction(transaction)
      const transactionHash = result.transactionHash.toHex()

      console.log(`Autonomous rebalance tx (${note}):`, transactionHash)

      return {
        transactionHash,
        explorerUrl: getTransactionExplorerUrl(transactionHash),
      }
    } catch (error) {
      lastError = formatRpcError(error)
      console.error(
        `Autonomous rebalance failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
        lastError
      )
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 600))
      }
    }
  }

  console.error('Autonomous rebalance ultimately failed:', lastError)
  return null
}

/**
 * Submit a `store_analysis` transaction to the PortfolioAgent contract.
 * Returns the transaction record, or null when not configured / on failure
 * (the analysis flow must never break because of the on-chain write).
 */
export const recordAnalysisOnChain = async (params: {
  walletAddress: string
  totalValueUsd: number
  riskLevel: string
  recommendationCount: number
  summaryHash: string
}): Promise<{ record: OnChainRecord | null; error: string | null }> => {
  const packageHash = process.env.PORTFOLIO_AGENT_PACKAGE_HASH
  const privateKey = loadAgentPrivateKey()
  if (!packageHash || !privateKey) {
    return { record: null, error: 'on-chain recording not configured' }
  }

  // U256 on-chain value: USD cents, avoids floats
  const totalValueCents = Math.max(0, Math.round(params.totalValueUsd * 100))

  // Build args once; a fresh transaction (new timestamp) is built per attempt.
  const buildArgs = () =>
    Args.fromMap({
      wallet_address: CLValue.newCLString(params.walletAddress),
      total_value: CLValue.newCLUInt256(totalValueCents),
      risk_level: CLValue.newCLString(params.riskLevel),
      recommendation_count: CLValue.newCLUint8(
        Math.min(255, params.recommendationCount)
      ),
      summary_hash: CLValue.newCLString(params.summaryHash),
    })

  // Retry across attempts: the public RPC node can intermittently reject or
  // time out, so a couple of attempts greatly improves reliability.
  const MAX_ATTEMPTS = 3
  let lastError: string | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const transaction = new ContractCallBuilder()
        .from(privateKey.publicKey)
        .byPackageHash(normalizeHash(packageHash))
        .entryPoint('store_analysis')
        .runtimeArgs(buildArgs())
        .chainName(CASPER_CHAIN_NAME)
        .payment(STORE_ANALYSIS_PAYMENT_MOTES, GAS_PRICE_TOLERANCE)
        .build()

      transaction.sign(privateKey)

      const rpcClient = new RpcClient(new HttpHandler(CASPER_NODE_RPC_URL))
      const result = await rpcClient.putTransaction(transaction)
      const transactionHash = result.transactionHash.toHex()

      return {
        record: {
          transactionHash,
          explorerUrl: getTransactionExplorerUrl(transactionHash),
          contractPackageHash: packageHash,
          network: CASPER_CHAIN_NAME,
          entryPoint: 'store_analysis',
        },
        error: null,
      }
    } catch (error) {
      lastError = formatRpcError(error)
      console.error(
        `On-chain analysis recording failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
        lastError
      )
      // brief backoff before retrying
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 600))
      }
    }
  }

  return { record: null, error: lastError }
}

/**
 * Safe, secret-free diagnostics for the on-chain agent configuration.
 * Reports which env vars are present and whether the key actually loads,
 * without ever returning the private key material.
 */
export const getAgentDiagnostics = () => {
  const hasPem = Boolean(process.env.CASPER_AGENT_PRIVATE_KEY_PEM)
  const hasHex = Boolean(process.env.CASPER_AGENT_PRIVATE_KEY_HEX)
  const hasPackageHash = Boolean(process.env.PORTFOLIO_AGENT_PACKAGE_HASH)
  const algorithm = (
    process.env.CASPER_AGENT_KEY_ALGORITHM || 'ed25519'
  ).toLowerCase()

  let keyLoads = false
  let publicKey: string | null = null
  let keyError: string | null = null
  try {
    const pk = loadAgentPrivateKey()
    if (pk) {
      keyLoads = true
      publicKey = pk.publicKey.toHex()
    }
  } catch (error) {
    keyError = error instanceof Error ? error.message : String(error)
  }

  return {
    isConfigured: isOnChainRecordingConfigured(),
    hasPem,
    hasHex,
    hasPackageHash,
    packageHashPrefix: process.env.PORTFOLIO_AGENT_PACKAGE_HASH
      ? `${normalizeHash(process.env.PORTFOLIO_AGENT_PACKAGE_HASH).slice(0, 8)}…`
      : null,
    gasPriceTolerance: GAS_PRICE_TOLERANCE,
    x402SettleAmountCspr: (X402_MICROPAYMENT_MOTES / 1_000_000_000).toFixed(2),
    algorithm,
    keyLoads,
    publicKey,
    keyError,
    chainName: CASPER_CHAIN_NAME,
    nodeRpcUrl: CASPER_NODE_RPC_URL,
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasAnthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    openAIModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    autonomousRebalanceEnabled: isAutonomousRebalanceEnabled(),
  }
}
