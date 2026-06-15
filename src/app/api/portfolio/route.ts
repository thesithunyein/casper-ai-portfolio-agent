import { fetchPortfolio } from '@/lib/casper'

/**
 * Server-side portfolio fetch. CSPR.cloud's REST API does not send CORS
 * headers for browser origins, so balance lookups must run on the server.
 * The client calls this endpoint instead of hitting CSPR.cloud directly.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')?.trim()

  if (!address) {
    return Response.json({ error: 'Missing address parameter.' }, { status: 400 })
  }

  try {
    const portfolio = await fetchPortfolio(address)
    return Response.json(portfolio, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch portfolio.'
    return Response.json({ error: message }, { status: 400 })
  }
}
