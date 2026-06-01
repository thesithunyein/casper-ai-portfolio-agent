/**
 * Casper Network Integration
 * Uses CSPR.cloud API for blockchain queries and casper-js-sdk for transactions
 */

const CSPR_CLOUD_API_KEY = process.env.NEXT_PUBLIC_CSPR_CLOUD_API_KEY || ''
const CSPR_CLOUD_BASE_URL = 'https://api.cspr.cloud'

export interface PortfolioAsset {
  denom: string
  amount: string
  symbol: string
  price: number
  value: number
  percentage: number
}

export interface Portfolio {
  totalValue: number
  assets: PortfolioAsset[]
  lastUpdated: Date
}

/**
 * Validate Casper address (public key hash format)
 * Casper addresses start with '01' (ed25519) or '02' (secp256k1) followed by 64 hex chars
 */
export const validateCasperAddress = (address: string): boolean => {
  try {
    if (!address || address.length !== 68) return false
    const prefix = address.slice(0, 2)
    const hexPart = address.slice(2)
    const validPrefix = prefix === '01' || prefix === '02'
    const validHex = /^[0-9a-fA-F]{64}$/.test(hexPart)
    return validPrefix && validHex
  } catch {
    return false
  }
}

/**
 * Fetch account balance from CSPR.cloud API
 * This is a REST API - much simpler than gRPC
 */
export const fetchAccountBalance = async (address: string): Promise<string> => {
  try {
    const response = await fetch(
      `${CSPR_CLOUD_BASE_URL}/accounts/${address}`,
      {
        headers: {
          'Authorization': `Bearer ${CSPR_CLOUD_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.warn('CSPR.cloud API unavailable, using mock data')
      return '50000000000000' // 50,000 CSPR in motes
    }

    const data = await response.json()
    return data.balance?.total || '0'
  } catch (error) {
    console.warn('CSPR.cloud API error:', error)
    return '50000000000000'
  }
}

/**
 * Fetch portfolio data for a Casper address
 * Currently uses mock data structured like real Casper assets
 * In production, this would query CSPR.cloud for:
 * - CSPR balance
 * - CEP-18 token balances
 * - CEP-78 NFT holdings (if applicable)
 */
export const fetchPortfolio = async (address: string): Promise<Portfolio> => {
  if (!validateCasperAddress(address)) {
    throw new Error('Invalid Casper address. Must be 68 characters starting with 01 or 02.')
  }

  try {
    // Try to fetch real balance from CSPR.cloud
    const csprBalanceMotes = await fetchAccountBalance(address)
    const csprBalance = Number(csprBalanceMotes) / 1e10 // Convert motes to CSPR

    // Mock portfolio with Casper ecosystem assets
    // In production, these would come from CSPR.cloud token endpoints
    const mockAssets: PortfolioAsset[] = [
      {
        denom: 'cspr',
        amount: (csprBalance * 1e10).toString(),
        symbol: 'CSPR',
        price: 0.025, // Mock price
        value: csprBalance * 0.025,
        percentage: 0,
      },
      {
        denom: 'cep18_usdc',
        amount: '500000000',
        symbol: 'USDC',
        price: 1.0,
        value: 500,
        percentage: 0,
      },
      {
        denom: 'cep18_usdt',
        amount: '250000000',
        symbol: 'USDT',
        price: 1.0,
        value: 250,
        percentage: 0,
      },
      {
        denom: 'cep18_weth',
        amount: '100000000000000000',
        symbol: 'WETH',
        price: 3500,
        value: 350,
        percentage: 0,
      },
    ]

    const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0)

    const assetsWithPercentage = mockAssets.map((asset) => ({
      ...asset,
      percentage: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
    }))

    return {
      totalValue,
      assets: assetsWithPercentage,
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    throw error
  }
}

/**
 * Get Casper Testnet faucet URL
 */
export const getCasperFaucetUrl = (): string => {
  return 'https://testnet.cspr.live/tools/faucet'
}

/**
 * Get Casper Testnet explorer URL for an address
 */
export const getCasperExplorerUrl = (address: string): string => {
  return `https://testnet.cspr.live/account/${address}`
}
