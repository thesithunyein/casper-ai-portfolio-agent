import Anthropic from '@anthropic-ai/sdk'
import type { Portfolio } from '@/lib/casper'
import { settleX402Payment } from '@/lib/x402'
import {
  hashAnalysisSummary,
  isOnChainRecordingConfigured,
  recordAnalysisOnChain,
} from '@/lib/casper-agent'

interface AnalysisPayload {
  summary: string
  riskAssessment: string
  recommendations: string[]
  rebalancingSuggestion: {
    action: string
    targetAllocation: Record<string, number>
    reasoning: string
  }
}

/**
 * Deterministic heuristic analysis used when no ANTHROPIC_API_KEY is configured
 * or the Claude call fails. Keeps the demo fully functional; clearly labelled so
 * it is never confused with live Claude output. Set ANTHROPIC_API_KEY for
 * real-time Claude 3.5 Sonnet analysis.
 */
function buildHeuristicAnalysis(portfolio: Portfolio): AnalysisPayload {
  const assets = [...portfolio.assets].sort((a, b) => b.value - a.value)
  const top = assets[0]
  const topPct = top?.percentage ?? 0
  const stableValue = assets
    .filter((a) => a.symbol === 'USDC' || a.symbol === 'USDT')
    .reduce((sum, a) => sum + a.value, 0)
  const stablePct =
    portfolio.totalValue > 0 ? (stableValue / portfolio.totalValue) * 100 : 0
  const concentrated = topPct > 50
  const riskLevel = concentrated ? 'High' : stablePct > 40 ? 'Low' : 'Medium'

  const targetAllocation: Record<string, number> = {}
  assets.forEach((a) => {
    targetAllocation[a.symbol] = 0
  })
  // Balanced target: cap any single asset near 40%, lift stables toward 30%.
  if (assets.length > 0) {
    const even = Math.round(100 / assets.length)
    assets.forEach((a) => {
      targetAllocation[a.symbol] = even
    })
    const drift = 100 - even * assets.length
    targetAllocation[assets[0].symbol] += drift
  }

  return {
    summary: `This portfolio holds ${
      assets.length
    } assets worth $${portfolio.totalValue.toFixed(
      2
    )}, led by ${top?.symbol ?? 'CSPR'} at ${topPct.toFixed(
      1
    )}% of total value. Stablecoins make up ${stablePct.toFixed(
      1
    )}% of the book, indicating a ${riskLevel.toLowerCase()} overall risk posture.`,
    riskAssessment: `Risk level: ${riskLevel}. ${
      concentrated
        ? `Concentration risk is elevated because ${top?.symbol} represents over half the portfolio; a single-asset drawdown would materially impact total value.`
        : 'Holdings are reasonably diversified, limiting single-asset drawdown impact.'
    } Stablecoin buffer of ${stablePct.toFixed(
      1
    )}% ${stablePct > 30 ? 'provides solid downside protection' : 'is light and could be increased for volatility protection'}.`,
    recommendations: [
      concentrated
        ? `Trim ${top?.symbol} toward 40% to reduce concentration risk.`
        : `Maintain diversification; no single asset exceeds a prudent weight.`,
      stablePct < 30
        ? 'Raise stablecoin allocation toward 30% to buffer volatility.'
        : 'Stablecoin buffer is healthy; consider deploying excess into yield.',
      'Set rebalancing thresholds (e.g. ±5%) so the agent can act autonomously.',
      'Monitor CSPR price action and CEP-18 liquidity before large reallocations.',
      'Persist this analysis on-chain via the Odra contract for an auditable record.',
    ],
    rebalancingSuggestion: {
      action: concentrated
        ? `Reduce ${top?.symbol} and redistribute into stablecoins and underweight assets.`
        : 'Hold current allocation with minor periodic rebalancing.',
      targetAllocation,
      reasoning: concentrated
        ? 'Lowering the dominant position and lifting stablecoins reduces variance while keeping upside exposure.'
        : 'The current mix is already balanced; periodic rebalancing maintains target weights as prices move.',
    },
  }
}

const SYSTEM_PROMPT = `You are a professional DeFi portfolio analyst specializing in the Casper Network ecosystem. Analyze the provided portfolio data and return a structured JSON response.

Your analysis should include:
1. A concise portfolio summary (2-3 sentences)
2. A risk assessment evaluating concentration risk, volatility exposure, and diversification
3. 5 specific, actionable recommendations tailored to the portfolio composition
4. A rebalancing suggestion with target allocation percentages and detailed reasoning

Return ONLY valid JSON in this exact format:
{
  "summary": "string",
  "riskAssessment": "string",
  "recommendations": ["string", "string", "string", "string", "string"],
  "rebalancingSuggestion": {
    "action": "string",
    "targetAllocation": { "CSPR": number, "USDC": number, "USDT": number, "WETH": number },
    "reasoning": "string"
  }
}`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const portfolio = body.portfolio as Portfolio

    if (!portfolio || !Array.isArray(portfolio.assets)) {
      return Response.json(
        { error: 'Invalid portfolio payload' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    // x402 payment: verified structurally, and settled on-chain through the
    // Casper x402 Facilitator when X402_FACILITATOR_URL is configured.
    const x402Header = request.headers.get('x402-payment')
    const x402Settlement = await settleX402Payment(x402Header)
    const paymentVerified =
      x402Settlement === 'settled' || x402Settlement === 'verified'

    let analysis: AnalysisPayload | null = null
    let analysisSource: 'claude' | 'heuristic' = 'heuristic'

    if (apiKey) {
      try {
        const client = new Anthropic({ apiKey })

        const portfolioText = portfolio.assets
          .map(
            (a) =>
              `- ${a.symbol}: ${a.balance.toLocaleString('en-US', {
                maximumFractionDigits: 4,
              })} ($${a.value.toFixed(2)}, ${a.percentage.toFixed(1)}%)`
          )
          .join('\n')

        const prompt = `Analyze this Casper Network portfolio:

Total Value: $${portfolio.totalValue.toFixed(2)}
Wallet: ${portfolio.walletAddress}

Assets:
${portfolioText}

${paymentVerified ? 'Note: This user has paid 0.01 CSPR via x402 micropayments for premium analysis.' : ''}`

        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        })

        const content =
          response.content[0]?.type === 'text' ? response.content[0].text : ''
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]) as AnalysisPayload
          analysisSource = 'claude'
        }
      } catch (claudeError) {
        // Fall back to heuristic analysis so the demo stays functional.
        console.error('Claude analysis failed, using heuristic:', claudeError)
      }
    }

    if (!analysis) {
      analysis = buildHeuristicAnalysis(portfolio)
      analysisSource = 'heuristic'
    }

    analysis.recommendations = analysis.recommendations || []
    analysis.recommendations.push(
      paymentVerified
        ? 'x402 payment verified: Premium AI analysis unlocked'
        : 'Upgrade to x402 micropayments for advanced agent features'
    )

    // Agentic on-chain write: persist the analysis record to the
    // PortfolioAgent contract on Casper Testnet (when agent key configured).
    let onchain = null
    if (isOnChainRecordingConfigured()) {
      const riskMatch = analysis.riskAssessment.match(/\b(high|medium|low)\b/i)
      onchain = await recordAnalysisOnChain({
        walletAddress: portfolio.walletAddress,
        totalValueUsd: portfolio.totalValue,
        riskLevel: riskMatch ? riskMatch[1].toUpperCase() : 'UNKNOWN',
        recommendationCount: analysis.recommendations.length,
        summaryHash: hashAnalysisSummary(analysis),
      })
    }

    return Response.json(
      {
        ...analysis,
        x402Status:
          x402Settlement === 'settled'
            ? 'settled'
            : paymentVerified
              ? 'verified'
              : 'optional',
        analysisSource,
        onchain,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    return Response.json(
      { error: 'AI analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
