import { getAgentDiagnostics } from '@/lib/casper-agent'

/**
 * Safe, secret-free diagnostics endpoint for the on-chain agent.
 * Hit /api/agent-status to verify which env vars are present and whether
 * the agent key loads. Never returns private key material.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json(getAgentDiagnostics(), { status: 200 })
}
