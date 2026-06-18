'use client'

import { Portfolio } from '@/lib/casper'

interface PortfolioDisplayProps {
  portfolio: Portfolio
}

export const PortfolioDisplay = ({ portfolio }: PortfolioDisplayProps) => {
  return (
    <div className="relative bg-white border border-border rounded-xl p-5 animate-fade-in shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Portfolio</h2>
            <p className="text-xs text-muted font-mono">{portfolio.assets.length} assets</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-muted uppercase">Total Value</p>
            <p className="text-lg font-semibold text-slate-900">
              ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {portfolio.assets.map((asset) => (
            <div key={asset.denom} className="p-3 bg-slate-50 border border-border rounded-lg hover:border-border-strong transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold rounded">
                    {asset.symbol[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{asset.symbol}</p>
                    <p className="text-xs text-muted font-mono">
                      {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} tokens
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs font-mono text-muted">{asset.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded transition-all duration-500" style={{ width: `${asset.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border text-xs font-mono text-muted">
          Last updated: {portfolio.lastUpdated.toLocaleTimeString()}
        </div>
      </div>
  )
}
