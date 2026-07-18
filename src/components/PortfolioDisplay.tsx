'use client'

import { Portfolio } from '@/lib/casper'

interface PortfolioDisplayProps {
  portfolio: Portfolio
}

export const PortfolioDisplay = ({ portfolio }: PortfolioDisplayProps) => {
  return (
    <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 animate-fade-in shadow-stripe-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">Portfolio</h2>
            <p className="text-xs text-ink-400 dark:text-ink-500 font-mono">{portfolio.assets.length} assets</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-0.5">
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  portfolio.isLiveData
                    ? 'text-emerald-600 bg-emerald-500/5 border-emerald-500/20'
                    : 'text-amber-600 bg-amber-500/5 border-amber-500/20'
                }`}
              >
                {portfolio.isLiveData ? 'LIVE' : 'DEMO'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider">Total Value</p>
            <p className="text-lg font-semibold text-ink-900 dark:text-white tracking-tight">
              ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {portfolio.assets.map((asset) => (
            <div key={asset.denom} className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg hover:border-black/[0.1] dark:hover:border-white/[0.1] transition-colors duration-300">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary/5 text-primary flex items-center justify-center text-[10px] font-bold rounded">
                    {asset.symbol[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-white">{asset.symbol}</p>
                    <p className="text-xs text-ink-400 dark:text-ink-500 font-mono">
                      {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} tokens
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-ink-900 dark:text-white">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs font-mono text-ink-400 dark:text-ink-500">{asset.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-ink-100 dark:bg-ink-800 rounded h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded transition-all duration-500" style={{ width: `${asset.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-xs font-mono text-ink-400 dark:text-ink-500">
          Last updated: {portfolio.lastUpdated.toLocaleTimeString()}
        </div>
      </div>
  )
}
