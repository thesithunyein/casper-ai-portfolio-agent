import Anthropic from '@anthropic-ai/sdk'
import type { Portfolio, AIAnalysis } from '@/lib/casper'

const SYSTEM_PROMPT = `You are the Casper AI Portfolio Agent — a concise DeFi portfolio assistant for the Casper Network.

Guidelines:
- Keep replies short (2-4 sentences) and precise.
- Ground every answer in the user's actual portfolio data when it is provided.
- Explain holdings, risk, RWA hedges, x402 micropayments, CSPR, CEP-18, and on-chain agent actions.
- Never invent balances or prices that are not in the provided data.
- Never claim a transaction succeeded unless a real explorer hash is present.
- You are not a financial advisor; frame suggestions as educational.`

function buildContext(
  portfolio: Portfolio | null,
  analysis: AIAnalysis | null
): string {
  if (!portfolio) {
    return 'The user has not connected a wallet yet, so no portfolio data is available.'
  }
  const assets = portfolio.assets
    .map(
      (a) =>
        `- ${a.symbol}: ${a.balance.toLocaleString('en-US', {
          maximumFractionDigits: 4,
        })} ($${a.value.toFixed(2)}, ${a.percentage.toFixed(1)}%)`
    )
    .join('\n')

  let ctx = `Wallet: ${portfolio.walletAddress}
Data source: ${portfolio.isLiveData ? 'live CSPR.cloud balances' : 'demo data'}
Total value: $${portfolio.totalValue.toFixed(2)}
Assets:
${assets}`

  if (analysis) {
    ctx += `\n\nLatest AI analysis:\nSummary: ${analysis.summary}\nRisk: ${analysis.riskAssessment}`
  }
  return ctx
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message: string = body.message || ''
    const portfolio: Portfolio | null = body.portfolio ?? null
    const analysis: AIAnalysis | null = body.analysis ?? null

    if (!message.trim()) {
      return Response.json({ error: 'Empty message' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Portfolio context:\n${buildContext(portfolio, analysis)}\n\nUser message: ${message}`,
        },
      ],
    })

    const reply =
      response.content[0]?.type === 'text' ? response.content[0].text : ''
    return Response.json({ message: reply }, { status: 200 })
  } catch (error) {
    console.error('Agent chat error:', error)
    return Response.json({ error: 'Agent chat failed' }, { status: 500 })
  }
}
