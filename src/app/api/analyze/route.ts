export async function POST(request: any) {
  try {
    const body = await request.json()
    const portfolio = body.portfolio

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const assetLines = portfolio.assets.map(
      (asset: any) =>
        `- ${asset.symbol}: ${(parseFloat(asset.amount) / 1e18).toFixed(4)} (${asset.percentage.toFixed(1)}% of portfolio, $${asset.value.toFixed(2)})`
    )

    const portfolioSummary = `Total Portfolio Value: $${portfolio.totalValue.toFixed(2)}
Assets:
${assetLines.join('\n')}`

    const prompt = `You are an expert portfolio analyst specializing in cryptocurrency and DeFi assets on the Injective blockchain.

Analyze the following portfolio and provide:
1. A brief summary of the portfolio composition
2. Risk assessment (volatility, concentration, diversification)
3. 3-5 specific, actionable recommendations
4. A rebalancing suggestion with target allocations

Portfolio Data:
${portfolioSummary}

Respond in JSON format with keys: summary, riskAssessment, recommendations (array), rebalancingSuggestion (object with action, targetAllocation object, reasoning).`

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
      return new Response(
        JSON.stringify({ error: error.error?.message || 'API error' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const responseText =
      data.content[0]?.type === 'text' ? data.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const analysis = JSON.parse(jsonMatch[0])
    return new Response(
      JSON.stringify(analysis),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
