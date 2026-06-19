'use client'

import { useEffect, useState } from 'react'

interface TokenData {
  id: number
  symbol: string
  color: string
  gradient: string
  size: number
  x: number
  y: number
  delay: number
  duration: number
  rotateDelay: number
}

const TOKENS = [
  { symbol: 'CSPR', color: '#ff4757', gradient: 'from-red-500 to-rose-600' },
  { symbol: 'BTC', color: '#f7931a', gradient: 'from-orange-400 to-amber-600' },
  { symbol: 'ETH', color: '#627eea', gradient: 'from-indigo-400 to-blue-600' },
  { symbol: 'USDC', color: '#2775ca', gradient: 'from-blue-400 to-blue-600' },
  { symbol: 'PAXG', color: '#e8c547', gradient: 'from-yellow-400 to-amber-500' },
  { symbol: 'ONDO', color: '#1d2025', gradient: 'from-slate-600 to-slate-800' },
  { symbol: 'TBILL', color: '#0a7d4b', gradient: 'from-emerald-400 to-green-600' },
  { symbol: 'CSPR', color: '#ff4757', gradient: 'from-red-500 to-rose-600' },
]

export const FloatingTokens = () => {
  const [mounted, setMounted] = useState(false)
  const [tokens, setTokens] = useState<TokenData[]>([])

  useEffect(() => {
    setMounted(true)
    const generated: TokenData[] = TOKENS.map((token, i) => ({
      id: i,
      symbol: token.symbol,
      color: token.color,
      gradient: token.gradient,
      size: 48 + Math.random() * 24,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      rotateDelay: Math.random() * 3,
    }))
    setTokens(generated)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {tokens.map((token) => (
        <div
          key={token.id}
          className="absolute"
          style={{
            left: `${token.x}%`,
            top: `${token.y}%`,
            animation: `tokenFloat ${token.duration}s ease-in-out ${token.delay}s infinite`,
          }}
        >
          {/* 3D Coin */}
          <div
            className="relative"
            style={{
              width: `${token.size}px`,
              height: `${token.size}px`,
              perspective: '200px',
            }}
          >
            <div
              className="relative w-full h-full"
              style={{
                animation: `tokenSpin 12s linear ${token.rotateDelay}s infinite`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${token.color}, ${token.color}dd)`,
                  backfaceVisibility: 'hidden',
                  boxShadow: `0 4px 20px ${token.color}30, inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`,
                  border: '2px solid rgba(255,255,255,0.15)',
                }}
              >
                {/* Inner ring */}
                <div
                  className="absolute inset-1.5 rounded-full border border-white/10"
                  style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)' }}
                />
                {/* Symbol */}
                <span
                  className="relative font-bold text-white tracking-tight"
                  style={{
                    fontSize: token.symbol.length > 3 ? `${token.size * 0.16}px` : `${token.size * 0.22}px`,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {token.symbol}
                </span>
                {/* Shine */}
                <div
                  className="absolute top-1 left-1/4 w-1/2 h-1/3 rounded-full opacity-30"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)',
                  }}
                />
              </div>

              {/* Back face */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(315deg, ${token.color}aa, ${token.color}88)`,
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)`,
                  border: '2px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="absolute inset-1.5 rounded-full border border-white/10" />
                <span
                  className="relative font-bold text-white/60 tracking-tight"
                  style={{ fontSize: `${token.size * 0.18}px` }}
                >
                  ◇
                </span>
              </div>

              {/* Edge thickness simulation */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `${token.color}60`,
                  transform: 'translateZ(-2px)',
                }}
              />
            </div>
          </div>

          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl -z-10"
            style={{
              background: `${token.color}20`,
              width: `${token.size}px`,
              height: `${token.size}px`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
