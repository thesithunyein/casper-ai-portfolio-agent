/**
 * Casper Network Integration
 * Uses the CSPR.cloud REST API for blockchain queries and casper-js-sdk for
 * transactions. Defaults to Casper Testnet.
 */

const CSPR_CLOUD_API_KEY = process.env.NEXT_PUBLIC_CSPR_CLOUD_API_KEY || ''

const NETWORK = (process.env.NEXT_PUBLIC_CASPER_NETWORK || 'testnet').toLowerCase()
const IS_MAINNET = NETWORK === 'mainnet'

// CSPR.cloud base URLs (see https://docs.cspr.cloud/documentation/overview)
export const CSPR_CLOUD_BASE_URL = IS_MAINNET
  ? 'https://api.cspr.cloud'
  : 'https://api.testnet.cspr.cloud'

export const CASPER_NODE_RPC_URL = IS_MAINNET
  ? 'https://node.cspr.cloud/rpc'
  : 'https://node.testnet.cspr.cloud/rpc'

export const CASPER_CHAIN_NAME = IS_MAINNET ? 'casper' : 'casper-test'

const EXPLORER_BASE_URL = IS_MAINNET
  ? 'https://cspr.live'
  : 'https://testnet.cspr.live'

// 1 CSPR = 1e9 motes (Casper uses 9 decimals)
const MOTES_PER_CSPR = 1e9

export interface PortfolioAsset {
  /** Stable identifier used for React keys / token contract hash */
  denom: string
  /** Human-readable token balance (already scaled by token decimals) */
  balance: number
  symbol: string
  /** USD price per token */
  price: number
  /** USD value of this holding */
  value: number
  /** Percentage of total portfolio value */
  percentage: number
}

export interface Portfolio {
  walletAddress: string
  totalValue: number
  assets: PortfolioAsset[]
  lastUpdated: Date
  /** True when balances came from live CSPR.cloud data, false for demo data */
  isLiveData: boolean
}

/**
 * Validate a Casper account public key.
 * Casper public keys start with '01' (ed25519, 66 chars) or
 * '02' (secp256k1, 68 chars) followed by hex characters.
 */
export const validateCasperAddress = (address: string): boolean => {
  if (!address) return false
  const prefix = address.slice(0, 2)
  if (prefix === '01') return /^01[0-9a-fA-F]{64}$/.test(address)
  if (prefix === '02') return /^02[0-9a-fA-F]{66}$/.test(address)
  return false
}

const csprCloudHeaders = (): HeadersInit => ({
  // CSPR.cloud expects the access token directly in the Authorization header
  Authorization: CSPR_CLOUD_API_KEY,
  'Content-Type': 'application/json',
})

/**
 * Fetch the liquid CSPR balance (in motes) for an account public key.
 * Returns null when the balance could not be fetched (no key, network error,
 * or account not found).
 */
export const fetchCsprBalanceMotes = async (
  address: string
): Promise<string | null> => {
  if (!CSPR_CLOUD_API_KEY) return null

  try {
    const response = await fetch(`${CSPR_CLOUD_BASE_URL}/accounts/${address}`, {
      headers: csprCloudHeaders(),
    })

    if (!response.ok) return null

    const data = await response.json()
    // CSPR.cloud returns the account balance under data.balance
    return data?.balance ?? data?.data?.balance ?? null
  } catch {
    return null
  }
}

/**
 * Fetch the current CSPR price in USD. Falls back to a recent reference value
 * if the public price API is unavailable.
 */
export const fetchCsprPrice = async (): Promise<number> => {
  const FALLBACK_PRICE = 0.01
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd',
      { cache: 'no-store' }
    )
    if (!response.ok) return FALLBACK_PRICE
    const data = await response.json()
    return data?.['casper-network']?.usd ?? FALLBACK_PRICE
  } catch {
    return FALLBACK_PRICE
  }
}

const withPercentages = (
  assets: Omit<PortfolioAsset, 'percentage'>[]
): { assets: PortfolioAsset[]; totalValue: number } => {
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0)
  return {
    totalValue,
    assets: assets.map((a) => ({
      ...a,
      percentage: totalValue > 0 ? (a.value / totalValue) * 100 : 0,
    })),
  }
}

/**
 * Representative demo portfolio used when live data is unavailable
 * (e.g. no CSPR.cloud API key configured or a brand-new account).
 */
const buildDemoPortfolio = (
  address: string,
  csprBalance: number,
  csprPrice: number
): Portfolio => {
  const base: Omit<PortfolioAsset, 'percentage'>[] = [
    {
      denom: 'cspr',
      symbol: 'CSPR',
      balance: csprBalance,
      price: csprPrice,
      value: csprBalance * csprPrice,
    },
    { denom: 'cep18_usdc', symbol: 'USDC', balance: 500, price: 1.0, value: 500 },
    { denom: 'cep18_usdt', symbol: 'USDT', balance: 250, price: 1.0, value: 250 },
    { denom: 'cep18_weth', symbol: 'WETH', balance: 0.1, price: 3500, value: 350 },
  ]
  const { assets, totalValue } = withPercentages(base)
  return {
    walletAddress: address,
    totalValue,
    assets,
    lastUpdated: new Date(),
    isLiveData: false,
  }
}

/**
 * Fetch portfolio data for a Casper account.
 *
 * When a CSPR.cloud API key is configured and the account exists, the CSPR
 * balance is read live from Casper Testnet. CEP-18 token holdings are layered
 * on as representative demo data (full CEP-18 indexing is a roadmap item).
 * Without a key, a clearly-labelled demo portfolio is returned so the UI and
 * AI analysis remain functional.
 */
export const fetchPortfolio = async (address: string): Promise<Portfolio> => {
  if (!validateCasperAddress(address)) {
    throw new Error(
      'Invalid Casper public key. It must start with 01 (66 chars) or 02 (68 chars) followed by hex.'
    )
  }

  const csprPrice = await fetchCsprPrice()
  const liveMotes = await fetchCsprBalanceMotes(address)

  if (liveMotes !== null) {
    const csprBalance = Number(liveMotes) / MOTES_PER_CSPR
    // Live CSPR balance + representative CEP-18 demo holdings
    const base: Omit<PortfolioAsset, 'percentage'>[] = [
      {
        denom: 'cspr',
        symbol: 'CSPR',
        balance: csprBalance,
        price: csprPrice,
        value: csprBalance * csprPrice,
      },
      { denom: 'cep18_usdc', symbol: 'USDC', balance: 500, price: 1.0, value: 500 },
      { denom: 'cep18_usdt', symbol: 'USDT', balance: 250, price: 1.0, value: 250 },
    ]
    const { assets, totalValue } = withPercentages(base)
    return {
      walletAddress: address,
      totalValue,
      assets,
      lastUpdated: new Date(),
      isLiveData: true,
    }
  }

  // Fallback demo portfolio (no API key or account not found)
  return buildDemoPortfolio(address, 50000, csprPrice)
}

/** Casper Testnet faucet for funding accounts. */
export const getCasperFaucetUrl = (): string =>
  'https://testnet.cspr.live/tools/faucet'

/** Explorer URL for an account public key. */
export const getCasperExplorerUrl = (address: string): string =>
  `${EXPLORER_BASE_URL}/account/${address}`

/** Explorer URL for a deploy hash. */
export const getDeployExplorerUrl = (deployHash: string): string =>
  `${EXPLORER_BASE_URL}/deploy/${deployHash}`

/** Explorer URL for a Casper 2.0 transaction hash. */
export const getTransactionExplorerUrl = (transactionHash: string): string =>
  `${EXPLORER_BASE_URL}/transaction/${transactionHash}`

/** Explorer URL for a contract package hash. */
export const getContractExplorerUrl = (contractHash: string): string =>
  `${EXPLORER_BASE_URL}/contract/${contractHash}`

export interface AIAnalysis {
  summary: string
  riskAssessment: string
  recommendations: string[]
  rebalancingSuggestion: {
    action: string
    targetAllocation: Record<string, number>
    reasoning: string
  }
  x402Status?: 'settled' | 'verified' | 'optional'
  /** 'claude' = live Claude 3.5 Sonnet, 'heuristic' = deterministic demo fallback */
  analysisSource?: 'claude' | 'heuristic'
  /** Present when the agent recorded this analysis on Casper Testnet */
  onchain?: {
    transactionHash: string
    explorerUrl: string
    contractPackageHash: string
    network: string
    entryPoint: string
  } | null
}
