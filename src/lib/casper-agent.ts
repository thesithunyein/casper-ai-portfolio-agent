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
  RpcClient,
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

/** Gas budget for a store_analysis call (motes). 5 CSPR is comfortable. */
const STORE_ANALYSIS_PAYMENT_MOTES = 5_000_000_000

const normalizeHash = (hash: string): string =>
  hash.replace(/^(hash-|contract-package-wasm|contract-package-)/, '')

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
}): Promise<OnChainRecord | null> => {
  const packageHash = process.env.PORTFOLIO_AGENT_PACKAGE_HASH
  const privateKey = loadAgentPrivateKey()
  if (!packageHash || !privateKey) return null

  try {
    // U256 on-chain value: USD cents, avoids floats
    const totalValueCents = Math.max(0, Math.round(params.totalValueUsd * 100))

    const args = Args.fromMap({
      wallet_address: CLValue.newCLString(params.walletAddress),
      total_value: CLValue.newCLUInt256(totalValueCents),
      risk_level: CLValue.newCLString(params.riskLevel),
      recommendation_count: CLValue.newCLUint8(
        Math.min(255, params.recommendationCount)
      ),
      summary_hash: CLValue.newCLString(params.summaryHash),
    })

    const transaction = new ContractCallBuilder()
      .from(privateKey.publicKey)
      .byPackageHash(normalizeHash(packageHash))
      .entryPoint('store_analysis')
      .runtimeArgs(args)
      .chainName(CASPER_CHAIN_NAME)
      .payment(STORE_ANALYSIS_PAYMENT_MOTES)
      .build()

    transaction.sign(privateKey)

    const rpcClient = new RpcClient(new HttpHandler(CASPER_NODE_RPC_URL))
    const result = await rpcClient.putTransaction(transaction)
    const transactionHash = result.transactionHash.toHex()

    return {
      transactionHash,
      explorerUrl: getTransactionExplorerUrl(transactionHash),
      contractPackageHash: packageHash,
      network: CASPER_CHAIN_NAME,
      entryPoint: 'store_analysis',
    }
  } catch (error) {
    console.error('On-chain analysis recording failed:', error)
    return null
  }
}
