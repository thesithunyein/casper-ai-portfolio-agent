import Anthropic from '@anthropic-ai/sdk'
import { Portfolio } from './injective'

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set. Please add it to your Vercel environment variables.')
  }
  return new Anthropic({ apiKey })
}

export interface AIAnalysis {
  summary: string
  riskAssessment: string
  recommendations: string[]
  rebalancingSuggestion: {
    action: string
    targetAllocation: Record<string, number>
    reasoning: string
  }
}

export const analyzePortfolio = async (
  portfolio: Portfolio
): Promise<AIAnalysis> => {
  const portfolioSummary = formatPortfolioForAI(portfolio)

  const prompt = `You are an expert portfolio analyst specializing in cryptocurrency and DeFi assets on the Injective blockchain.

Analyze the following portfolio and provide:
1. A brief summary of the portfolio composition
2. Risk assessment (volatility, concentration, diversification)
3. 3-5 specific, actionable recommendations
4. A rebalancing suggestion with target allocations

Portfolio Data:
${portfolioSummary}

Respond in JSON format with keys: summary, riskAssessment, recommendations (array), rebalancingSuggestion (object with action, targetAllocation object, reasoning).`

  try {
    const client = getClient()
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis = JSON.parse(jsonMatch[0]) as AIAnalysis
    return analysis
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    throw error
  }
}

const formatPortfolioForAI = (portfolio: Portfolio): string => {
  const assetLines = portfolio.assets.map(
    (asset) =>
      `- ${asset.symbol}: ${(parseFloat(asset.amount) / 1e18).toFixed(4)} (${asset.percentage.toFixed(1)}% of portfolio, $${asset.value.toFixed(2)})`
  )

  return `Total Portfolio Value: $${portfolio.totalValue.toFixed(2)}
Assets:
${assetLines.join('\n')}`
}

export const generateInsight = async (topic: string): Promise<string> => {
  const client = getClient()
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Provide a brief, actionable insight about ${topic} in the context of Injective blockchain and DeFi. Keep it to 1-2 sentences.`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
