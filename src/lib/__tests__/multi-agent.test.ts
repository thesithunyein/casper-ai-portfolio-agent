import { runMultiAgentCoordination, getMultiAgentStatus, AGENT_CONFIGS } from '@/lib/multi-agent'

describe('Multi-Agent Coordination', () => {
  it('should have 5 agent configurations', () => {
    expect(Object.keys(AGENT_CONFIGS)).toHaveLength(5)
    expect(AGENT_CONFIGS.portfolio).toBeDefined()
    expect(AGENT_CONFIGS.risk).toBeDefined()
    expect(AGENT_CONFIGS.treasury).toBeDefined()
    expect(AGENT_CONFIGS.oracle).toBeDefined()
    expect(AGENT_CONFIGS['yield-router']).toBeDefined()
  })

  it('should return agent status list', () => {
    const status = getMultiAgentStatus()
    expect(status).toHaveLength(5)
    status.forEach((s) => {
      expect(s.role).toBeDefined()
      expect(s.name).toBeDefined()
      expect(s.status).toBe('ready')
    })
  })

  it('should run multi-agent coordination and return results', async () => {
    const result = await runMultiAgentCoordination({
      walletAddress: '0203556ee5f1a8f1b8d1c6c5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5',
      portfolio: {
        assets: [
          { symbol: 'CSPR', amount: 1000, valueUsd: 25000 },
          { symbol: 'USDC', amount: 5000, valueUsd: 5000 },
        ],
        totalValue: 30000,
      },
      riskLevel: 'MEDIUM',
      recommendationCount: 5,
      summaryHash: 'abc123',
      rebalancingAction: 'Reduce CSPR concentration',
    })

    expect(result).toBeDefined()
    expect(result.results).toHaveLength(5)
    expect(result.totalActions).toBe(5)
    expect(result.coordinationSummary).toBeDefined()
    expect(typeof result.successfulActions).toBe('number')
  })

  it('should handle empty portfolio gracefully', async () => {
    const result = await runMultiAgentCoordination({
      walletAddress: '0203556ee5f1a8f1b8d1c6c5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5',
      portfolio: {
        assets: [],
        totalValue: 0,
      },
      riskLevel: 'LOW',
      recommendationCount: 0,
      summaryHash: 'empty',
      rebalancingAction: 'Hold current allocation',
    })

    expect(result.results).toHaveLength(5)
    const riskResult = result.results.find((r) => r.role === 'risk')
    expect(riskResult).toBeDefined()
  })
})
