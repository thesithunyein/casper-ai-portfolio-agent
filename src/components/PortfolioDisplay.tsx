'use client'

import { Portfolio } from '@/lib/injective'
import { TrendingUp, PieChart } from 'lucide-react'

interface PortfolioDisplayProps {
  portfolio: Portfolio
}

export const PortfolioDisplay = ({ portfolio }: PortfolioDisplayProps) => {
  return (
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Your Portfolio</h2>
            <p className="text-gray-500 text-sm">{portfolio.assets.length} assets tracked</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Total Value</p>
          <p className="text-3xl font-bold gradient-text">
            ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {portfolio.assets.map((asset, index) => (
          <div
            key={asset.denom}
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-primary">
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{asset.symbol}</p>
                  <p className="text-sm text-gray-500 font-mono">
                    {(parseFloat(asset.amount) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 4 })} tokens
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">
                  ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-primary font-mono">
                  {asset.percentage.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${asset.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center gap-2 text-xs text-gray-600">
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="font-mono">Last updated: {portfolio.lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
