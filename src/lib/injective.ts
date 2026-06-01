export const getInjectiveEndpoints = () => {
  return {
    grpc: 'https://testnet.lcd.injective.network:443',
  }
}

export const validateInjectiveAddress = (address: string): boolean => {
  try {
    return address.startsWith('inj') && address.length === 42
  } catch {
    return false
  }
}

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

export const fetchPortfolio = async (address: string): Promise<Portfolio> => {
  if (!validateInjectiveAddress(address)) {
    throw new Error('Invalid Injective address')
  }

  try {
    const mockAssets: PortfolioAsset[] = [
      {
        denom: 'inj',
        amount: '250000000000000000000',
        symbol: 'INJ',
        price: 8.5,
        value: 2125,
        percentage: 0,
      },
      {
        denom: 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '500000000',
        symbol: 'USDC',
        price: 1.0,
        value: 500,
        percentage: 0,
      },
      {
        denom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
        amount: '250000000',
        symbol: 'USDT',
        price: 1.0,
        value: 250,
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
