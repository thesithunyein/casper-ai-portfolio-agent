'use client'

import { useEffect, useState } from 'react'
import { Bot, ExternalLink, Shield } from 'lucide-react'

interface AgentStatus {
  isConfigured?: boolean
  keyLoads?: boolean
  publicKey?: string | null
  chainName?: string
  autonomousRebalanceEnabled?: boolean
  x402Facilitator?: string
  hasOpenAI?: boolean
  hasAnthropic?: boolean
}

/**
 * Surfaces a verifiable agent identity for judges — public key, settle mode,
 * and capability flags from the secret-free /api/agent-status endpoint.
 */
export const AgentIdentityCard = () => {
  const [status, setStatus] = useState<AgentStatus | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/agent-status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setStatus(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!status) return null

  const shortKey = status.publicKey
    ? `${status.publicKey.slice(0, 12)}…${status.publicKey.slice(-8)}`
    : 'Not loaded'

  const settleMode =
    status.x402Facilitator && !status.x402Facilitator.includes('not configured')
      ? 'Facilitator + agent-wallet fallback'
      : status.keyLoads
        ? 'Agent-wallet on-chain settle'
        : 'Header verify only'

  return (
    <div className="bg-white dark:bg-ink-900 border border-violet-200 dark:border-violet-500/20 rounded-xl p-5 shadow-stripe-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">
            Agent Identity
          </h2>
        </div>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            status.keyLoads
              ? 'text-emerald-600 bg-emerald-500/5 border-emerald-500/20'
              : 'text-amber-600 bg-amber-500/5 border-amber-500/20'
          }`}
        >
          {status.keyLoads ? 'LIVE SIGNER' : 'DEMO MODE'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
          <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">
            Agent public key
          </p>
          {status.publicKey ? (
            <a
              href={`https://testnet.cspr.live/account/${status.publicKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-violet-600 font-mono text-xs break-all hover:underline"
            >
              {shortKey}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          ) : (
            <p className="text-xs font-mono text-ink-500">{shortKey}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
            <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">
              Network
            </p>
            <p className="text-xs font-mono text-ink-900 dark:text-white">
              {status.chainName || 'casper-test'}
            </p>
          </div>
          <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
            <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">
              x402 settle
            </p>
            <p className="text-xs font-mono text-ink-900 dark:text-white leading-snug">
              {settleMode}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-ink-50 dark:bg-ink-800 border border-black/[0.06] dark:border-white/[0.06] text-ink-600 dark:text-ink-300">
            <Shield className="w-3 h-3" />
            {status.isConfigured ? 'On-chain writes armed' : 'On-chain writes off'}
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-ink-50 dark:bg-ink-800 border border-black/[0.06] dark:border-white/[0.06] text-ink-600 dark:text-ink-300">
            AI: {status.hasOpenAI ? 'GPT' : status.hasAnthropic ? 'Claude' : 'Heuristic'}
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-ink-50 dark:bg-ink-800 border border-black/[0.06] dark:border-white/[0.06] text-ink-600 dark:text-ink-300">
            Rebalance: {status.autonomousRebalanceEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  )
}
