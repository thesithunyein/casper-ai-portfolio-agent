'use server'

import { Portfolio } from '@/lib/injective'

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

const formatPortfolioForAI = (portfolio: Portfolio): string => {
  const assetLines = portfolio.assets.map(
    (asset) =>
      `- ${asset.symbol}: ${(parseFloat(asset.amount) / 1e18).toFixed(4)} (${asset.percentage.toFixed(1)}% of portfolio, $${asset.value.toFixed(2)})`
  )

  return `Total Portfolio Value: $${portfolio.totalValue.toFixed(2)}
Assets:
${assetLines.join('\n')}`
}

export async function analyzePortfolioAction(
  portfolio: Portfolio
): Promise<AIAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set')
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
  }

  try {
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

    console.log('Calling Claude API')
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API error:', error)
      throw new Error(`API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const responseText =
      data.content[0]?.type === 'text' ? data.content[0].text : ''

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
