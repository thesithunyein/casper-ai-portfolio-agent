export const dynamic = 'force-dynamic'

interface RWAFeedCache {
  data: RWAFeedResponse | null
  timestamp: number
}

interface TreasuryResponse {
  data: Array<{
    record_date: string
    avg_interest_rate_amt: string
  }>
}

interface CoinGeckoPrice {
  usd: number
  usd_24h_change?: number
}

interface CoinGeckoResponse {
  [key: string]: CoinGeckoPrice
}

export interface RWAFeedResponse {
  tbill: {
    yield: number
    date: string
    source: string
  }
  paxg: {
    price: number
    change24h: number
    name: string
    ticker: string
    source: string
  }
  ondo: {
    price: number
    change24h: number
    name: string
    ticker: string
    source: string
  }
  timestamp: string
  status: 'live' | 'stale' | 'error'
}

/** In-memory cache with 60-second TTL */
let cache: RWAFeedCache = { data: null, timestamp: 0 }
const CACHE_TTL_MS = 60_000

async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeoutId)
    return res
  } catch {
    clearTimeout(timeoutId)
    return null
  }
}

async function fetchTBillYield(): Promise<{
  yield: number
  date: string
} | null> {
  const url =
    'https://api.fiscaldata.treasury.gov/services/api/v1/accounting/od/avg_interest_rates?fields=record_date,avg_interest_rate_amt&filter=security_desc:eq:Treasury%20Bills&sort=-record_date&page[size]=1'

  const res = await fetchWithTimeout(url, 8_000)
  if (!res || !res.ok) return null

  try {
    const data = (await res.json()) as TreasuryResponse
    const record = data?.data?.[0]
    if (!record) return null
    return {
      yield: parseFloat(record.avg_interest_rate_amt),
      date: record.record_date,
    }
  } catch {
    return null
  }
}

async function fetchCoinGeckoPrices(): Promise<{
  paxg: CoinGeckoPrice | null
  ondo: CoinGeckoPrice | null
  usdc: CoinGeckoPrice | null
} | null> {
  const url =
    'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,ondo-finance,usd-coin&vs_currencies=usd&include_24hr_change=true'

  const res = await fetchWithTimeout(url, 8_000)
  if (!res || !res.ok) return null

  try {
    const data = (await res.json()) as CoinGeckoResponse
    return {
      paxg: data['pax-gold'] ?? null,
      ondo: data['ondo-finance'] ?? null,
      usdc: data['usd-coin'] ?? null,
    }
  } catch {
    return null
  }
}

export async function GET() {
  const now = Date.now()

  // Return cached data if fresh
  if (cache.data && now - cache.timestamp < CACHE_TTL_MS) {
    return Response.json(cache.data, { status: 200 })
  }

  // Fetch all sources in parallel
  const [tbillResult, coinGeckoResult] = await Promise.all([
    fetchTBillYield(),
    fetchCoinGeckoPrices(),
  ])

  const hasTbill = tbillResult !== null
  const hasCoinGecko = coinGeckoResult !== null

  // If we have cached data and any source failed, return stale cache
  if (cache.data && (!hasTbill || !hasCoinGecko)) {
    const staleResponse: RWAFeedResponse = {
      ...cache.data,
      timestamp: new Date().toISOString(),
      status: 'stale',
    }
    return Response.json(staleResponse, { status: 200 })
  }

  // If no data at all and no cache, return error response
  if (!hasTbill && !hasCoinGecko && !cache.data) {
    const errorResponse: RWAFeedResponse = {
      tbill: { yield: 0, date: '', source: 'Treasury.gov' },
      paxg: { price: 0, change24h: 0, name: 'PAX Gold', ticker: 'PAXG', source: 'CoinGecko' },
      ondo: { price: 0, change24h: 0, name: 'Ondo Finance', ticker: 'ONDO', source: 'CoinGecko' },
      timestamp: new Date().toISOString(),
      status: 'error',
    }
    return Response.json(errorResponse, { status: 200 })
  }

  // Build response from available data
  const response: RWAFeedResponse = {
    tbill: {
      yield: tbillResult?.yield ?? cache.data?.tbill.yield ?? 0,
      date: tbillResult?.date ?? cache.data?.tbill.date ?? '',
      source: 'Treasury.gov',
    },
    paxg: {
      price: coinGeckoResult?.paxg?.usd ?? cache.data?.paxg.price ?? 0,
      change24h: coinGeckoResult?.paxg?.usd_24h_change ?? cache.data?.paxg.change24h ?? 0,
      name: 'PAX Gold',
      ticker: 'PAXG',
      source: 'CoinGecko',
    },
    ondo: {
      price: coinGeckoResult?.ondo?.usd ?? cache.data?.ondo.price ?? 0,
      change24h: coinGeckoResult?.ondo?.usd_24h_change ?? cache.data?.ondo.change24h ?? 0,
      name: 'Ondo Finance',
      ticker: 'ONDO',
      source: 'CoinGecko',
    },
    timestamp: new Date().toISOString(),
    status: hasTbill && hasCoinGecko ? 'live' : 'stale',
  }

  // Update cache
  cache = { data: response, timestamp: now }

  return Response.json(response, { status: 200 })
}
