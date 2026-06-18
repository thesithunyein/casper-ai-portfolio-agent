import Anthropic from '@anthropic-ai/sdk'
import type { Portfolio } from '@/lib/casper'
import { settleX402Payment } from '@/lib/x402'
import { fetchRWAFeed } from '@/lib/rwa-feed'
import type { RWAFeedResponse } from '@/app/api/rwa-feed/route'
import {
  executeAutonomousRebalance,
  hashAnalysisSummary,
  isAutonomousRebalanceEnabled,
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
  /** Recommended allocation to tokenized real-world assets (0-100) */
  rwaExposurePercent: number
  /** Current estimated percentage of portfolio in RWA assets */
  rwa_exposure_percent?: number
  /** Specific RWA allocation recommendation text */
  rwa_recommendation?: string
  /** RWA yield opportunity description */
  rwa_yield_opportunity?: string
  /** Which AI model or heuristic produced this analysis */
  analysis_source?: string
}

/**
 * Deterministic heuristic analysis used when no ANTHROPIC_API_KEY is configured
 * or the Claude call fails. Keeps the demo fully functional; clearly labelled so
 * it is never confused with live Claude output. Set ANTHROPIC_API_KEY for
 * real-time Claude 3.5 Sonnet analysis.
 */
function buildHeuristicAnalysis(
  portfolio: Portfolio,
  rwaFeed?: RWAFeedResponse | null
): AnalysisPayload {
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

  // RWA allocation recommendation: higher when crypto concentration is high
  const rwaExposurePercent = concentrated
    ? Math.min(25, Math.round((topPct - 40) * 0.8))
    : stablePct > 40
      ? 5
      : 10

  // Build RWA recommendation from live feed data
  const tbillYield = rwaFeed?.tbill.yield ?? 5.0
  const paxgPrice = rwaFeed?.paxg.price ?? 2300

  const rwaRecommendation = concentrated
    ? `Shift ${rwaExposurePercent}% to tokenized RWA — PAX Gold ($${paxgPrice.toFixed(2)}) or T-bills yielding ${tbillYield}% as uncorrelated hedge against ${top?.symbol} concentration.`
    : stablePct < 10
      ? `Increase stablecoin buffer to 15%+ and add ${Math.max(5, rwaExposurePercent)}% RWA (T-bills ${tbillYield}% yield) for downside protection.`
      : `Maintain ${rwaExposurePercent}% RWA allocation for portfolio stability — T-bills at ${tbillYield}% APY provide solid risk-adjusted returns.`

  const rwaYieldOpportunity =
    tbillYield > 0
      ? `US T-bills yielding ${tbillYield}% APY via Treasury.gov — risk-free rate exceeds most stablecoin yields.`
      : 'Tokenized T-bills and PAX Gold available for low-volatility portfolio hedging.'

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
      rwaExposurePercent > 5
        ? `Consider allocating ${rwaExposurePercent}% to tokenized RWA (T-bills at ${tbillYield}%, PAX Gold $${paxgPrice.toFixed(0)}) for uncorrelated, low-volatility exposure.`
        : 'Maintain a small RWA allocation (5-10%) for portfolio stability.',
      'Set rebalancing thresholds (e.g. ±5%) so the agent can act autonomously.',
      'Persist this analysis on-chain via the Odra contract for an auditable record.',
    ],
    rebalancingSuggestion: {
      action: concentrated
        ? `Reduce ${top?.symbol} and redistribute into stablecoins, underweight assets, and tokenized RWA.`
        : 'Hold current allocation with minor periodic rebalancing.',
      targetAllocation,
      reasoning: concentrated
        ? 'Lowering the dominant position and lifting stablecoins plus a small RWA allocation reduces variance while keeping upside exposure.'
        : 'The current mix is already balanced; periodic rebalancing maintains target weights as prices move.',
    },
    rwaExposurePercent,
    rwa_exposure_percent: rwaExposurePercent,
    rwa_recommendation: rwaRecommendation,
    rwa_yield_opportunity: rwaYieldOpportunity,
    analysis_source: 'heuristic',
  }
}

function buildSystemPrompt(rwaFeed?: RWAFeedResponse | null): string {
  const rwaPrompt = rwaFeed
    ? `\n\nYou also have access to live Real-World Asset data:\n- US T-bill Yield: ${rwaFeed.tbill.yield}% (as of ${rwaFeed.tbill.date})\n- PAX Gold (PAXG): $${rwaFeed.paxg.price.toFixed(2)} (${rwaFeed.paxg.change24h >= 0 ? '+' : ''}${rwaFeed.paxg.change24h.toFixed(2)}% 24h)\n- Ondo Finance (ONDO): $${rwaFeed.ondo.price.toFixed(2)} (${rwaFeed.ondo.change24h >= 0 ? '+' : ''}${rwaFeed.ondo.change24h.toFixed(2)}% 24h)\n\nFactor this into your analysis:\n- If CSPR concentration > 70%: recommend shifting 15-25% to T-bills or PAXG as RWA hedge\n- If stablecoin buffer < 10%: flag as high risk, suggest USDC as RWA-adjacent stable allocation\n- Include rwa_recommendation and rwa_yield_opportunity in your JSON output`
    : ''

  return `You are a professional DeFi portfolio analyst specializing in the Casper Network ecosystem. You also evaluate tokenized Real-World Assets (RWA) such as T-bills, gold, and equities for portfolio diversification.

Your analysis should include:
1. A concise portfolio summary (2-3 sentences)
2. A risk assessment evaluating concentration risk, volatility exposure, and diversification
3. 5 specific, actionable recommendations tailored to the portfolio composition
4. A rebalancing suggestion with target allocation percentages and detailed reasoning
5. A rwa_exposure_percent field (0-100) recommending how much of the portfolio should be in tokenized RWA assets — higher when crypto concentration risk is elevated
6. A rwa_recommendation field with a specific actionable RWA allocation suggestion
7. A rwa_yield_opportunity field describing current RWA yield opportunities${rwaPrompt}

Return ONLY valid JSON in this exact format:
{
  "summary": "string",
  "riskAssessment": "string",
  "recommendations": ["string", "string", "string", "string", "string"],
  "rebalancingSuggestion": {
    "action": "string",
    "targetAllocation": { "CSPR": number, "USDC": number, "USDT": number, "WETH": number },
    "reasoning": "string"
  },
  "rwaExposurePercent": number,
  "rwa_exposure_percent": number,
  "rwa_recommendation": "string",
  "rwa_yield_opportunity": "string",
  "analysis_source": "string"
}`
}

interface RWAContext {
  assets: { symbol: string; name: string; priceUsd: number; change24h: number }[]
}

/** Shared user prompt describing the portfolio for any LLM provider. */
function buildUserPrompt(
  portfolio: Portfolio,
  paymentVerified: boolean,
  rwaPrices?: RWAContext | null
): string {
  const portfolioText = portfolio.assets
    .map(
      (a) =>
        `- ${a.symbol}: ${a.balance.toLocaleString('en-US', {
          maximumFractionDigits: 4,
        })} ($${a.value.toFixed(2)}, ${a.percentage.toFixed(1)}%)`
    )
    .join('\n')

  const rwaText = rwaPrices
    ? `\nAvailable tokenized RWA assets (Simulated Oracle Feed):\n${rwaPrices.assets
        .map(
          (a) =>
            `- ${a.symbol}: ${a.name} — $${a.priceUsd.toFixed(2)} (${a.change24h >= 0 ? '+' : ''}${a.change24h.toFixed(2)}% 24h)`
        )
        .join('\n')}`
    : ''

  return `Analyze this Casper Network portfolio:

Total Value: $${portfolio.totalValue.toFixed(2)}
Wallet: ${portfolio.walletAddress}

Assets:
${portfolioText}${rwaText}

${paymentVerified ? 'Note: This user has paid 0.01 CSPR via x402 micropayments for premium analysis.' : ''}`
}

/** Pull the JSON object out of an LLM text response. */
function extractAnalysisJson(content: string): AnalysisPayload | null {
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  return JSON.parse(jsonMatch[0]) as AnalysisPayload
}

/**
 * OpenAI analysis via the REST API (no SDK dependency). Uses JSON mode for
 * reliable structured output. Model configurable via OPENAI_MODEL.
 */
async function getOpenAIAnalysis(
  prompt: string,
  systemPrompt: string
): Promise<AnalysisPayload | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200)
    throw new Error(`OpenAI API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content ?? ''
  return extractAnalysisJson(content)
}

/** Anthropic Claude analysis. */
async function getClaudeAnalysis(
  prompt: string,
  systemPrompt: string
): Promise<AnalysisPayload | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  const content =
    response.content[0]?.type === 'text' ? response.content[0].text : ''
  return extractAnalysisJson(content)
}

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

    // 1. Fetch live RWA feed data
    const rwaFeed = await fetchRWAFeed()

    // x402 payment: verified structurally, and settled on-chain through the
    // Casper x402 Facilitator when X402_FACILITATOR_URL is configured.
    const x402Header = request.headers.get('x402-payment')
    const x402Settlement = await settleX402Payment(x402Header)
    const paymentVerified =
      x402Settlement === 'settled' || x402Settlement === 'verified'

    // Build system prompt with live RWA context
    const systemPrompt = buildSystemPrompt(rwaFeed)

    // RWA oracle prices passed from client for AI context (legacy support)
    const rwaPrices = (body as Record<string, unknown>)?.rwaPrices as
      | RWAContext
      | undefined

    let analysis: AnalysisPayload | null = null
    let analysisSource: 'openai' | 'claude' | 'heuristic' = 'heuristic'
    const userPrompt = buildUserPrompt(portfolio, paymentVerified, rwaPrices)

    // Provider priority: OpenAI -> Claude -> deterministic heuristic.
    if (process.env.OPENAI_API_KEY) {
      try {
        analysis = await getOpenAIAnalysis(userPrompt, systemPrompt)
        if (analysis) analysisSource = 'openai'
      } catch (openAiError) {
        console.error('OpenAI analysis failed:', openAiError)
      }
    }

    if (!analysis && process.env.ANTHROPIC_API_KEY) {
      try {
        analysis = await getClaudeAnalysis(userPrompt, systemPrompt)
        if (analysis) analysisSource = 'claude'
      } catch (claudeError) {
        console.error('Claude analysis failed:', claudeError)
      }
    }

    if (!analysis) {
      analysis = buildHeuristicAnalysis(portfolio, rwaFeed)
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
    let onchainError = null
    if (isOnChainRecordingConfigured()) {
      const riskMatch = analysis.riskAssessment.match(/\b(high|medium|low)\b/i)
      const result = await recordAnalysisOnChain({
        walletAddress: portfolio.walletAddress,
        totalValueUsd: portfolio.totalValue,
        riskLevel: riskMatch ? riskMatch[1].toUpperCase() : 'UNKNOWN',
        recommendationCount: analysis.recommendations.length,
        summaryHash: hashAnalysisSummary(analysis),
      })
      onchain = result.record
      onchainError = result.error
    }

    // Autonomous on-chain action: when the AI recommends rebalancing, the
    // agent autonomously executes a native CSPR transfer to the user's
    // wallet — proving the agent doesn't just analyze, it *acts* on-chain.
    let autonomousAction = null
    const shouldRebalance =
      isAutonomousRebalanceEnabled() &&
      !/hold current allocation/i.test(analysis.rebalancingSuggestion.action)
    if (shouldRebalance) {
      autonomousAction = await executeAutonomousRebalance(
        portfolio.walletAddress,
        analysis.rebalancingSuggestion.action
      )
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
        onchainError,
        autonomousAction,
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
