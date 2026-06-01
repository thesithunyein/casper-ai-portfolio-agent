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

    // Generate realistic mock AI analysis based on portfolio data
    const mockAnalysis = {
      summary: `Your portfolio is valued at $${portfolio.totalValue.toFixed(2)} with ${portfolio.assets.length} assets. The portfolio shows a ${portfolio.assets[0]?.percentage > 50 ? 'concentrated' : 'diversified'} allocation with ${portfolio.assets[0]?.symbol} as the largest holding at ${portfolio.assets[0]?.percentage.toFixed(1)}%.`,
      riskAssessment: `Moderate risk profile. ${portfolio.assets[0]?.percentage > 60 ? 'High concentration in ' + portfolio.assets[0]?.symbol + ' increases volatility exposure.' : 'Reasonable diversification across assets.'} Stablecoins provide ${portfolio.assets.find((a: any) => a.symbol === 'USDC' || a.symbol === 'USDT') ? 'some downside protection' : 'limited downside protection'}.`,
      recommendations: [
        `Consider reducing ${portfolio.assets[0]?.symbol} allocation from ${portfolio.assets[0]?.percentage.toFixed(0)}% to 50-55% for better risk management`,
        'Add more stablecoin allocation (USDC/USDT) to 30-40% for portfolio stability',
        'Diversify into WETH (5-10%) for Ethereum ecosystem exposure',
        'Set stop-losses at -15% from current prices for major holdings',
        'Review and rebalance portfolio monthly based on market conditions'
      ],
      rebalancingSuggestion: {
        action: 'Rebalance to reduce concentration risk and improve diversification',
        targetAllocation: {
          INJ: 50,
          USDC: 30,
          USDT: 15,
          WETH: 5
        },
        reasoning: 'This allocation reduces single-asset risk while maintaining growth exposure. The 50% INJ allocation still provides significant upside potential, while 45% stablecoins offer downside protection. The 5% WETH allocation adds Ethereum ecosystem diversification.'
      }
    }

    return new Response(
      JSON.stringify(mockAnalysis),
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
