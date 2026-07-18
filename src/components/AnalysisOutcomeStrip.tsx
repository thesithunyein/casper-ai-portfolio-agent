'use client'

import { ExternalLink, CheckCircle2, Loader2 } from 'lucide-react'
import type { AIAnalysis } from '@/lib/casper'

interface AnalysisOutcomeStripProps {
  analysis: AIAnalysis
  loading?: boolean
}

/** Compact proof strip — what actually happened in this run. */
export const AnalysisOutcomeStrip = ({ analysis, loading }: AnalysisOutcomeStripProps) => {
  const risk =
    analysis.riskAssessment?.toLowerCase().includes('high')
      ? 'High'
      : analysis.riskAssessment?.toLowerCase().includes('low')
        ? 'Low'
        : 'Medium'

  const chips = [
    {
      label: 'x402',
      value:
        analysis.x402Status === 'settled'
          ? 'Settled'
          : analysis.x402Status === 'verified'
            ? 'Verified'
            : 'Optional',
      ok: analysis.x402Status === 'settled',
      href: analysis.x402Payment?.explorerUrl,
    },
    {
      label: 'On-chain',
      value: analysis.onchain
        ? 'store_analysis'
        : analysis.onchainError
          ? 'Failed'
          : 'Skipped',
      ok: Boolean(analysis.onchain),
      href: analysis.onchain?.explorerUrl,
    },
    {
      label: 'Reputation',
      value: analysis.reputation
        ? `${analysis.reputation.grade} · ${analysis.reputation.score}`
        : '—',
      ok: (analysis.reputation?.score ?? 0) >= 70,
    },
    {
      label: 'Risk',
      value: risk,
      ok: risk !== 'High',
    },
    {
      label: 'AI',
      value:
        analysis.analysisSource === 'openai'
          ? 'GPT-4o'
          : analysis.analysisSource === 'claude'
            ? 'Claude'
            : 'Heuristic',
      ok: analysis.analysisSource !== 'heuristic',
    },
  ]

  return (
    <div className="bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-4 shadow-stripe-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider">
          Run outcome
        </p>
        {loading ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-primary">
            <Loader2 className="w-3 h-3 animate-spin" />
            Running
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-600">
            <CheckCircle2 className="w-3 h-3" />
            Complete
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const inner = (
            <span
              key={chip.label}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] ${
                chip.ok
                  ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-ink-50 dark:bg-ink-800/50 border-black/[0.06] dark:border-white/[0.06] text-ink-600 dark:text-ink-300'
              }`}
            >
              <span className="font-mono text-ink-400 dark:text-ink-500">{chip.label}</span>
              <span className="font-semibold">{chip.value}</span>
              {chip.href && <ExternalLink className="w-3 h-3 opacity-60" />}
            </span>
          )
          return chip.href ? (
            <a key={chip.label} href={chip.href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <span key={chip.label}>{inner}</span>
          )
        })}
      </div>
    </div>
  )
}
