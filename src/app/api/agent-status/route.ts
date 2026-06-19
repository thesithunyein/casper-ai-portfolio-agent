import { getAgentDiagnostics } from '@/lib/casper-agent'
import { getMCPDiagnostics } from '@/lib/mcp-client'

/**
 * Safe, secret-free diagnostics endpoint for the on-chain agent.
 * Hit /api/agent-status to verify which env vars are present and whether
 * the agent key loads. Never returns private key material.
 * Also reports MCP server configuration status.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json(
    {
      ...getAgentDiagnostics(),
      mcp: getMCPDiagnostics(),
      x402Facilitator: process.env.X402_FACILITATOR_URL
        ? `${process.env.X402_FACILITATOR_URL.replace(/\/$/, '')} (configured)`
        : 'not configured',
    },
    { status: 200 }
  )
}
