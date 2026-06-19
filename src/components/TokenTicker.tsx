'use client'

import { useEffect, useState } from 'react'

interface TickerToken {
  symbol: string
  price: string
  change: number
}

const INITIAL_TOKENS: TickerToken[] = [
  { symbol: 'CSPR', price: '$0.0142', change: 2.34 },
  { symbol: 'BTC', price: '$67,234', change: 1.12 },
  { symbol: 'ETH', price: '$3,456', change: -0.45 },
  { symbol: 'USDC', price: '$1.000', change: 0.01 },
  { symbol: 'PAXG', price: '$2,345', change: 0.78 },
  { symbol: 'ONDO', price: '$1.23', change: 3.45 },
  { symbol: 'TBILL', price: '$99.87', change: 0.02 },
]

export const TokenTicker = () => {
  const [mounted, setMounted] = useState(false)
  const [tokens, setTokens] = useState(INITIAL_TOKENS)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTokens(prev =>
        prev.map(t => ({
          ...t,
          change: t.change + (Math.random() - 0.5) * 0.3,
        }))
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const doubled = [...tokens, ...tokens]

  return (
    <div className="relative z-20 border-b border-black/[0.04] dark:border-white/[0.04] bg-white/40 dark:bg-ink-950/40 backdrop-blur-sm overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {doubled.map((token, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-xs font-mono">
            <span className="font-semibold text-ink-900 dark:text-white">{token.symbol}</span>
            <span className="text-ink-500 dark:text-ink-400">{token.price}</span>
            <span
              className={`font-medium ${
                token.change >= 0 ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {token.change >= 0 ? '▲' : '▼'} {Math.abs(token.change).toFixed(2)}%
            </span>
            <span className="text-ink-300 dark:text-ink-700 ml-2">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
