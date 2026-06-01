'use client'

import { Portfolio } from '@/lib/injective'
import { PieChart, Heart, Sparkles } from 'lucide-react'

interface PortfolioDisplayProps {
  portfolio: Portfolio
}

export const PortfolioDisplay = ({ portfolio }: PortfolioDisplayProps) => {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 animate-fade-in shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-black">Your Portfolio</h2>
              <Heart className="w-4 h-4 text-cute-dark animate-pulse" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">{portfolio.assets.length} assets tracked</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider font-semibold">Total Value</p>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {portfolio.assets.map((asset) => (
          <div
            key={asset.denom}
            className="group p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-cute/30 hover:bg-white transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary shadow-sm">
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="font-semibold text-black">{asset.symbol}</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {(parseFloat(asset.amount) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 4 })} tokens
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">
                  ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-primary font-mono font-bold">
                  {asset.percentage.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary via-cute-dark to-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${asset.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t-2 border-gray-100 flex items-center gap-2 text-xs text-gray-500 font-semibold">
        <Sparkles className="w-4 h-4 text-cute-dark" />
        <span className="font-mono">Last updated: {portfolio.lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
