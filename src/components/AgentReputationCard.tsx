'use client'

import { Award, Info } from 'lucide-react'
import type { AgentReputation } from '@/lib/agent-reputation'

interface AgentReputationCardProps {
  reputation: AgentReputation
}

export const AgentReputationCard = ({ reputation }: AgentReputationCardProps) => {
  const barColor =
    reputation.grade === 'A'
      ? 'bg-emerald-500'
      : reputation.grade === 'B'
        ? 'bg-sky-500'
        : reputation.grade === 'C'
          ? 'bg-amber-500'
          : 'bg-ink-400'

  return (
    <div className="bg-white dark:bg-ink-900 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 shadow-stripe-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">
            Agent Reputation
          </h2>
        </div>
        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/5 border border-amber-500/20 px-1.5 py-0.5 rounded">
          GRADE {reputation.grade}
        </span>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <p className="text-3xl font-bold text-ink-900 dark:text-white tracking-tight tabular-nums">
          {reputation.score}
        </p>
        <p className="text-xs text-ink-500 dark:text-ink-400 pb-1">/ 100 · {reputation.label}</p>
      </div>

      <div className="w-full bg-ink-100 dark:bg-ink-800 rounded h-2 overflow-hidden mb-4">
        <div
          className={`${barColor} h-full rounded transition-all duration-700`}
          style={{ width: `${reputation.score}%` }}
        />
      </div>

      <div className="space-y-1.5 mb-3">
        {reputation.breakdown.map((row) => (
          <div key={row.factor} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-ink-500 dark:text-ink-400 truncate">{row.factor}</span>
            <span className="font-mono text-ink-900 dark:text-white flex-shrink-0">
              {row.points}/{row.max}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 p-2.5 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
        <Info className="w-3.5 h-3.5 text-ink-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
          {reputation.committedOnChain
            ? 'Inputs committed on-chain via store_analysis summary hash.'
            : 'Will commit on-chain when agent key is configured.'}{' '}
          {reputation.methodology}
        </p>
      </div>
    </div>
  )
}
