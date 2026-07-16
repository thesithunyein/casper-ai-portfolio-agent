/**
 * Agent reputation score — Casper-themed verifiable quality signal.
 *
 * Casper's buildathon example directions call out "verifiable on-chain identity
 * and reputation score based on historical accuracy." We compute a transparent
 * 0–100 score from the current agentic run and fold it into the analysis
 * summary hash that is already written on-chain via store_analysis — so the
 * reputation inputs are committed in the on-chain record.
 */

export interface ReputationInput {
  analysisSource: 'openai' | 'claude' | 'heuristic'
  x402Settled: boolean
  onchainRecorded: boolean
  autonomousAction: boolean
  multiAgentSuccessRate: number // 0–1
  yieldOpportunities: number
  rwaFeedUsed: boolean
  recommendationCount: number
}

export interface AgentReputation {
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  label: string
  breakdown: { factor: string; points: number; max: number }[]
  committedOnChain: boolean
  methodology: string
}

export const computeAgentReputation = (input: ReputationInput): AgentReputation => {
  const breakdown: AgentReputation['breakdown'] = [
    {
      factor: 'AI model quality',
      points:
        input.analysisSource === 'openai'
          ? 20
          : input.analysisSource === 'claude'
            ? 18
            : 8,
      max: 20,
    },
    {
      factor: 'x402 micropayment settled',
      points: input.x402Settled ? 20 : 0,
      max: 20,
    },
    {
      factor: 'On-chain store_analysis',
      points: input.onchainRecorded ? 25 : 0,
      max: 25,
    },
    {
      factor: 'Multi-agent coordination',
      points: Math.round(input.multiAgentSuccessRate * 15),
      max: 15,
    },
    {
      factor: 'Autonomous rebalance action',
      points: input.autonomousAction ? 10 : 0,
      max: 10,
    },
    {
      factor: 'RWA + yield context',
      points:
        (input.rwaFeedUsed ? 5 : 0) +
        (input.yieldOpportunities > 0 ? 5 : 0),
      max: 10,
    },
  ]

  // Small completeness bonus for actionable recommendations
  if (input.recommendationCount >= 3) {
    breakdown.push({ factor: 'Actionable recommendations', points: 5, max: 5 })
  } else {
    breakdown.push({
      factor: 'Actionable recommendations',
      points: Math.min(5, input.recommendationCount),
      max: 5,
    })
  }

  const score = Math.min(
    100,
    breakdown.reduce((sum, b) => sum + b.points, 0)
  )

  const grade: AgentReputation['grade'] =
    score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D'

  const label =
    grade === 'A'
      ? 'High-trust agentic run'
      : grade === 'B'
        ? 'Solid agentic run'
        : grade === 'C'
          ? 'Partial agentic run'
          : 'Degraded / demo mode'

  return {
    score,
    grade,
    label,
    breakdown,
    committedOnChain: input.onchainRecorded,
    methodology:
      'Score 0–100 from AI quality, x402 settle, on-chain write, multi-agent success, rebalance, RWA/yield. Inputs hashed into store_analysis summary_hash.',
  }
}
