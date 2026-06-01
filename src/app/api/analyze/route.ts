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

    // x402 Payment Verification
    const x402Header = request.headers.get('x402-payment')
    let paymentVerified = false
    if (x402Header) {
      try {
        const paymentData = JSON.parse(Buffer.from(x402Header.replace('x402-payment: ', ''), 'base64').toString())
        paymentVerified = paymentData.token === 'CSPR' && parseFloat(paymentData.amount) >= 0.01
      } catch {
        paymentVerified = false
      }
    }

    // Get primary asset for Casper ecosystem
    const primaryAsset = portfolio.assets.find((a: any) => a.symbol === 'CSPR') || portfolio.assets[0]
    const hasStablecoins = portfolio.assets.some((a: any) => a.symbol === 'USDC' || a.symbol === 'USDT')

    // Generate realistic mock AI analysis based on portfolio data
    const mockAnalysis = {
      summary: `Your Casper portfolio is valued at $${portfolio.totalValue.toFixed(2)} with ${portfolio.assets.length} assets. The portfolio shows a ${primaryAsset?.percentage > 50 ? 'concentrated' : 'diversified'} allocation with ${primaryAsset?.symbol} as the largest holding at ${primaryAsset?.percentage.toFixed(1)}%.`,
      riskAssessment: `Moderate risk profile. ${primaryAsset?.percentage > 60 ? 'High concentration in ' + primaryAsset?.symbol + ' increases volatility exposure.' : 'Reasonable diversification across assets.'} Stablecoins provide ${hasStablecoins ? 'some downside protection' : 'limited downside protection'}.`,
      recommendations: [
        `Consider reducing ${primaryAsset?.symbol} allocation from ${primaryAsset?.percentage.toFixed(0)}% to 50-55% for better risk management`,
        'Add more stablecoin allocation (USDC/USDT) to 30-40% for portfolio stability',
        'Diversify into WETH (5-10%) for cross-chain exposure',
        'Set stop-losses at -15% from current prices for major holdings',
        'Review and rebalance portfolio monthly based on market conditions',
        paymentVerified ? 'x402 payment verified: Premium AI analysis unlocked' : 'Upgrade to x402 micropayments for advanced agent features'
      ],
      rebalancingSuggestion: {
        action: 'Rebalance to reduce concentration risk and improve diversification on Casper',
        targetAllocation: {
          CSPR: 50,
          USDC: 30,
          USDT: 15,
          WETH: 5
        },
        reasoning: 'This allocation reduces single-asset risk while maintaining growth exposure. The 50% CSPR allocation still provides significant upside potential within the Casper ecosystem, while 45% stablecoins offer downside protection. The 5% WETH allocation adds cross-chain diversification.'
      },
      x402Status: paymentVerified ? 'verified' : 'optional'
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
