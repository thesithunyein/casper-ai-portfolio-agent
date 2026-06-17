export const dynamic = 'force-dynamic'

export interface RWAAsset {
  symbol: string
  name: string
  category: 't_bill' | 'gold' | 'equity' | 'reit'
  priceUsd: number
  change24h: number
  source: string
  simulated: true
}

export interface RWAPriceFeed {
  assets: RWAAsset[]
  timestamp: string
  feedLabel: string
}

/**
 * Simulated Real-World Asset (RWA) price feed.
 *
 * This endpoint returns representative tokenized RWA prices to demonstrate
 * how the agent factors real-world assets into portfolio rebalancing.
 * In production, this would integrate with a live oracle such as
 * Chainlink or a Casper-native price feed for tokenized securities.
 */
export async function GET() {
  const feed: RWAPriceFeed = {
    feedLabel: 'Simulated RWA Feed',
    timestamp: new Date().toISOString(),
    assets: [
      {
        symbol: 'TBILL',
        name: 'Tokenized US Treasury 3-Month Bill',
        category: 't_bill',
        priceUsd: 99.87,
        change24h: 0.02,
        source: 'Simulated — TradFi benchmark (Bloomberg US Treasury)',
        simulated: true,
      },
      {
        symbol: 'XAU',
        name: 'Tokenized Gold (per oz)',
        category: 'gold',
        priceUsd: 2345.6,
        change24h: 0.45,
        source: 'Simulated — LBMA Gold Price benchmark',
        simulated: true,
      },
      {
        symbol: 'SPY',
        name: 'Tokenized S&P 500 Index',
        category: 'equity',
        priceUsd: 532.14,
        change24h: 1.12,
        source: 'Simulated — NYSE closing prices',
        simulated: true,
      },
      {
        symbol: 'REIT',
        name: 'Tokenized Commercial REIT',
        category: 'reit',
        priceUsd: 18.42,
        change24h: -0.15,
        source: 'Simulated — FTSE Nareit benchmark',
        simulated: true,
      },
    ],
  }

  return Response.json(feed, { status: 200 })
}
