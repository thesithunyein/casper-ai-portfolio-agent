'use client'

import { Portfolio } from '@/lib/casper'

interface PortfolioDisplayProps {
  portfolio: Portfolio
}

export const PortfolioDisplay = ({ portfolio }: PortfolioDisplayProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-500" />
      <div className="relative bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Portfolio</h2>
            <p className="text-xs text-muted font-mono">{portfolio.assets.length} assets</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-muted uppercase">Total Value</p>
            <p className="text-lg font-semibold text-white">
              ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {portfolio.assets.map((asset) => (
            <div key={asset.denom} className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 text-white flex items-center justify-center text-[10px] font-bold rounded">
                    {asset.symbol[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{asset.symbol}</p>
                    <p className="text-xs text-muted font-mono">
                      {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} tokens
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs font-mono text-muted">{asset.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-neon-cyan to-neon-purple h-full rounded transition-all duration-500" style={{ width: `${asset.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 text-xs font-mono text-muted">
          Last updated: {portfolio.lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
