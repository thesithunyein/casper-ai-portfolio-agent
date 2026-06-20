'use client'

import { CheckCircle2, XCircle, AlertCircle, Bot, Shield, Wallet, Eye, Route } from 'lucide-react'

interface MultiAgentPanelProps {
  data: {
    summary: string
    totalActions: number
    successfulActions: number
    agents: {
      role: string
      name: string
      action: string
      status: string
    }[]
  }
}

const AGENT_ICONS: Record<string, typeof Bot> = {
  portfolio: Bot,
  risk: Shield,
  treasury: Wallet,
  oracle: Eye,
  'yield-router': Route,
}

const AGENT_COLORS: Record<string, string> = {
  portfolio: 'text-blue-500 bg-blue-500/5 border-blue-500/20',
  risk: 'text-red-500 bg-red-500/5 border-red-500/20',
  treasury: 'text-violet-500 bg-violet-500/5 border-violet-500/20',
  oracle: 'text-amber-500 bg-amber-500/5 border-amber-500/20',
  'yield-router': 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20',
}

export const MultiAgentPanel = ({ data }: MultiAgentPanelProps) => {
  const successRate = data.totalActions > 0
    ? Math.round((data.successfulActions / data.totalActions) * 100)
    : 0

  return (
    <div className="bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">
            Multi-Agent Coordination
          </h2>
        </div>
        <span className="text-xs font-mono text-emerald-600 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded">
          {data.successfulActions}/{data.totalActions} succeeded
        </span>
      </div>

      {/* Success Rate Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider">
            Coordination Score
          </span>
          <span className="text-xs font-mono text-ink-600 dark:text-ink-300">{successRate}%</span>
        </div>
        <div className="w-full bg-ink-100 dark:bg-ink-800 rounded h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-primary h-full rounded transition-all duration-700"
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Agent List */}
      <div className="space-y-2">
        {data.agents.map((agent, idx) => {
          const Icon = AGENT_ICONS[agent.role] || Bot
          const colorClass = AGENT_COLORS[agent.role] || AGENT_ICONS.portfolio
          const isSuccess = agent.status === 'success' || agent.status === 'completed'
          const isFailed = agent.status === 'failed' || agent.status === 'error'

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 border rounded-lg ${colorClass}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-ink-900 dark:text-white">
                    {agent.name}
                  </span>
                  {isSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  ) : isFailed ? (
                    <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                  {agent.action}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
        <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">
          Coordination Summary
        </p>
        <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
          {data.summary}
        </p>
      </div>
    </div>
  )
}
