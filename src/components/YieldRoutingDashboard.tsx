'use client'

import { Route, TrendingUp, Server } from 'lucide-react'

interface YieldRoutingDashboardProps {
  data: {
    opportunities: number
    bestApy: number
    bestProtocol: string | null
    recommendedRoutes: {
      protocol: string
      token: string
      apy: number
      riskAdjustedApy: number
      riskScore: number
      riskLevel: string
      tvlUsd: number
      allocationPct: number
    }[]
    totalAvailableTvl: number
    mcpServersUsed: number
  }
}

const RISK_COLORS: Record<string, string> = {
  low: 'text-emerald-600 bg-emerald-500/5 border-emerald-500/20',
  medium: 'text-amber-600 bg-amber-500/5 border-amber-500/20',
  high: 'text-red-600 bg-red-500/5 border-red-500/20',
}

export const YieldRoutingDashboard = ({ data }: YieldRoutingDashboardProps) => {
  const hasOpportunities = data.opportunities > 0 && data.recommendedRoutes.length > 0

  return (
    <div className="bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">
            Yield Routing
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-mono text-ink-400 dark:text-ink-500">
            <Server className="w-3 h-3" />
            {data.mcpServersUsed} MCP
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2.5 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-center">
          <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-1">
            Opportunities
          </p>
          <p className="text-lg font-bold text-ink-900 dark:text-white">{data.opportunities}</p>
        </div>
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-center">
          <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1">
            Best APY
          </p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-500">
            {data.bestApy.toFixed(2)}%
          </p>
        </div>
        <div className="p-2.5 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-center">
          <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-1">
            Total TVL
          </p>
          <p className="text-lg font-bold text-ink-900 dark:text-white">
            ${(data.totalAvailableTvl / 1e6).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Best Protocol Badge */}
      {data.bestProtocol && (
        <div className="mb-4 flex items-center gap-2 p-2.5 bg-gradient-to-r from-emerald-500/5 to-primary/5 border border-emerald-500/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-ink-600 dark:text-ink-300">
            Top yield: <span className="font-semibold text-emerald-700 dark:text-emerald-500">{data.bestProtocol}</span>
          </span>
        </div>
      )}

      {/* Recommended Routes */}
      {hasOpportunities ? (
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-2 tracking-wider">
            Recommended Routes
          </p>
          {data.recommendedRoutes.map((route, idx) => {
            const riskKey = (route.riskLevel || 'medium').toLowerCase()
            const riskClass = RISK_COLORS[riskKey] || RISK_COLORS.medium

            return (
              <div
                key={idx}
                className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink-900 dark:text-white">
                      {route.protocol}
                    </span>
                    <span className="text-[10px] font-mono text-ink-400 dark:text-ink-500">
                      {route.token}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${riskClass}`}>
                    {route.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <p className="text-[9px] font-mono text-ink-400 dark:text-ink-500 uppercase">APY</p>
                    <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-500">
                      {route.apy.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-ink-400 dark:text-ink-500 uppercase">Risk-Adj</p>
                    <p className="text-xs font-mono font-semibold text-primary">
                      {route.riskAdjustedApy.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-ink-400 dark:text-ink-500 uppercase">TVL</p>
                    <p className="text-xs font-mono text-ink-600 dark:text-ink-300">
                      ${(route.tvlUsd / 1e6).toFixed(1)}M
                    </p>
                  </div>
                </div>

                {/* Allocation Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-ink-400 dark:text-ink-500 uppercase">
                    Alloc
                  </span>
                  <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-primary h-full rounded transition-all duration-500"
                      style={{ width: `${route.allocationPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-ink-600 dark:text-ink-300 w-8 text-right">
                    {route.allocationPct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-4 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-center">
          <p className="text-xs text-ink-400 dark:text-ink-500">
            No yield opportunities found. Configure CSPR.trade MCP server to discover DeFi pools.
          </p>
        </div>
      )}
    </div>
  )
}
