export const dynamic = 'force-dynamic'

import { fetchRWAFeed } from '@/lib/rwa-feed'

export async function GET() {
  const data = await fetchRWAFeed()
  return Response.json(data, { status: 200 })
}
