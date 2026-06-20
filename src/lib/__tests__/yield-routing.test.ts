import { routeYields, discoverYieldOpportunities } from '@/lib/yield-routing'

describe('Yield Routing', () => {
  it('should return a valid routing result structure', async () => {
    const result = await routeYields({
      walletAddress: '0203556ee5f1a8f1b8d1c6c5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5',
      portfolioTokens: ['CSPR', 'USDC'],
      riskTolerance: 'moderate',
    })

    expect(result).toBeDefined()
    expect(result.opportunities).toBeDefined()
    expect(Array.isArray(result.opportunities)).toBe(true)
    expect(result.recommendedRoutes).toBeDefined()
    expect(Array.isArray(result.recommendedRoutes)).toBe(true)
    expect(typeof result.totalAvailableTvl).toBe('number')
    expect(typeof result.averageApy).toBe('number')
    expect(result.timestamp).toBeDefined()
  })

  it('should handle no MCP servers gracefully', async () => {
    const opportunities = await discoverYieldOpportunities(
      '0203556ee5f1a8f1b8d1c6c5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5',
      ['CSPR']
    )

    expect(Array.isArray(opportunities)).toBe(true)
    // Without MCP configured, should return empty array
    expect(opportunities.length).toBe(0)
  })

  it('should return empty routes when no opportunities', async () => {
    const result = await routeYields({
      walletAddress: '0203556ee5f1a8f1b8d1c6c5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5',
      portfolioTokens: ['CSPR'],
      riskTolerance: 'conservative',
    })

    expect(result.recommendedRoutes).toHaveLength(0)
    expect(result.bestOpportunity).toBeNull()
  })
})
