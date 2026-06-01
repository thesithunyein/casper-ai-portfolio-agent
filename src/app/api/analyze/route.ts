import Anthropic from '@anthropic-ai/sdk'

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
        const paymentData = JSON.parse(atob(x402Header.replace('x402-payment: ', '')))
        paymentVerified = paymentData.token === 'CSPR' && parseFloat(paymentData.amount) >= 0.01
      } catch {
        paymentVerified = false
      }
    }

    const client = new Anthropic({ apiKey })

    const portfolioText = portfolio.assets.map((a: any) =>
      `- ${a.symbol}: ${a.balance.toFixed(4)} ($${a.value.toFixed(2)}, ${a.percentage.toFixed(1)}%)`
    ).join('\n')

    const prompt = `Analyze this Casper Network portfolio:\n\nTotal Value: $${portfolio.totalValue.toFixed(2)}\nWallet: ${portfolio.walletAddress}\n\nAssets:\n${portfolioText}\n\n${paymentVerified ? 'Note: This user has paid 0.01 CSPR via x402 micropayments for premium analysis.' : ''}`

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    if (!analysis) {
      throw new Error('Failed to parse Claude response')
    }

    // Add x402 status and payment-related recommendation
    analysis.recommendations.push(
      paymentVerified
        ? 'x402 payment verified: Premium AI analysis unlocked'
        : 'Upgrade to x402 micropayments for advanced agent features'
    )
    analysis.x402Status = paymentVerified ? 'verified' : 'optional'

    return new Response(
      JSON.stringify(analysis),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    return new Response(
      JSON.stringify({ error: 'AI analysis failed. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
