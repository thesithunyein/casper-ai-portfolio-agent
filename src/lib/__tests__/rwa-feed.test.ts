import { fetchRWAFeed } from '@/lib/rwa-feed'

// Mock global fetch
global.fetch = jest.fn()

describe('RWA Feed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should return a valid RWAFeedResponse structure', async () => {
    const result = await fetchRWAFeed()

    expect(result).toBeDefined()
    expect(result.tbill).toBeDefined()
    expect(result.paxg).toBeDefined()
    expect(result.ondo).toBeDefined()
    expect(result.timestamp).toBeDefined()
    expect(['live', 'stale', 'error']).toContain(result.status)
  })

  it('should have numeric yield for tbill', async () => {
    const result = await fetchRWAFeed()
    expect(typeof result.tbill.yield).toBe('number')
    expect(result.tbill.yield).toBeGreaterThanOrEqual(0)
  })

  it('should have numeric price for paxg', async () => {
    const result = await fetchRWAFeed()
    expect(typeof result.paxg.price).toBe('number')
    expect(result.paxg.price).toBeGreaterThanOrEqual(0)
  })

  it('should have numeric price for ondo', async () => {
    const result = await fetchRWAFeed()
    expect(typeof result.ondo.price).toBe('number')
    expect(result.ondo.price).toBeGreaterThanOrEqual(0)
  })

  it('should include source attribution', async () => {
    const result = await fetchRWAFeed()
    expect(result.tbill.source).toBe('Treasury.gov')
    expect(result.paxg.source).toBe('CoinGecko')
    expect(result.ondo.source).toBe('CoinGecko')
  })
})
