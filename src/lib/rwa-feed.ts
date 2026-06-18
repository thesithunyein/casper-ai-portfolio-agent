import type { RWAFeedResponse } from '@/app/api/rwa-feed/route'

/**
 * Fetch live RWA data from the internal /api/rwa-feed endpoint.
 * Works both in local dev and Vercel production.
 */
export async function fetchRWAFeed(): Promise<RWAFeedResponse | null> {
  try {
    // Build absolute URL — works in both local dev and Vercel
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/rwa-feed`, {
      cache: 'no-store',
    })

    if (!res.ok) return null
    return (await res.json()) as RWAFeedResponse
  } catch {
    return null
  }
}
