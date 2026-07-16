import { computeAgentReputation } from '../agent-reputation'

describe('computeAgentReputation', () => {
  it('scores a full agentic run highly', () => {
    const result = computeAgentReputation({
      analysisSource: 'openai',
      x402Settled: true,
      onchainRecorded: true,
      autonomousAction: true,
      multiAgentSuccessRate: 1,
      yieldOpportunities: 3,
      rwaFeedUsed: true,
      recommendationCount: 4,
    })
    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.grade).toBe('A')
    expect(result.committedOnChain).toBe(true)
  })

  it('scores degraded demo mode lower', () => {
    const result = computeAgentReputation({
      analysisSource: 'heuristic',
      x402Settled: false,
      onchainRecorded: false,
      autonomousAction: false,
      multiAgentSuccessRate: 0,
      yieldOpportunities: 0,
      rwaFeedUsed: false,
      recommendationCount: 1,
    })
    expect(result.score).toBeLessThan(50)
    expect(result.grade).toBe('D')
  })
})
