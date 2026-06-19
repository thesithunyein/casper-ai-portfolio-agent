'use client'

import { useEffect, useState } from 'react'
import { Building2, Gem, TrendingUp } from 'lucide-react'
import type { RWAFeedResponse } from '@/lib/rwa-feed'

export const RWADashboard = () => {
  const [data, setData] = useState<RWAFeedResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/rwa-feed', { cache: 'no-store' })
      if (res.ok) {
        const json = (await res.json()) as RWAFeedResponse
        setData(json)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [])

  const formatYield = (val: number | undefined | null) =>
    typeof val === 'number' && !isNaN(val) ? `${val.toFixed(2)}% APY` : '—'
  const formatPrice = (val: number | undefined | null) =>
    typeof val === 'number' && !isNaN(val)
      ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—'
  const formatChange = (val: number | undefined | null) => {
    if (typeof val !== 'number' || isNaN(val)) return '—'
    const sign = val >= 0 ? '+' : ''
    return `${sign}${val.toFixed(2)}%`
  }

  return (
    <section className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">Live RWA Intelligence</h2>
          <p className="text-base text-ink-500 dark:text-ink-400 max-w-md mx-auto">
            Real-world asset data factored into every AI rebalancing decision
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* T-bill Card */}
          <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm overflow-hidden hover:shadow-stripe-md hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-ink-500 dark:text-ink-400">US Treasury T-bill</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium text-emerald-600">Live</span>
              </div>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-24 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-xl font-bold text-ink-900 dark:text-white tracking-tight">
                  {formatYield(data?.tbill?.yield)}
                </p>
                <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1">via Treasury.gov</p>
              </>
            )}
          </div>

          {/* PAX Gold Card */}
          <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm overflow-hidden hover:shadow-stripe-md hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Gem className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-ink-500 dark:text-ink-400">PAX Gold (PAXG)</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium text-emerald-600">Live</span>
              </div>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-24 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-xl font-bold text-ink-900 dark:text-white tracking-tight">
                  {formatPrice(data?.paxg?.price)}
                </p>
                <p className={`text-xs font-medium mt-1 ${(data?.paxg?.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatChange(data?.paxg?.change24h)} 24h
                </p>
                <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1">via CoinGecko</p>
              </>
            )}
          </div>

          {/* Ondo Finance Card */}
          <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm overflow-hidden hover:shadow-stripe-md hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-ink-500 dark:text-ink-400">Ondo Finance (ONDO)</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium text-emerald-600">Live</span>
              </div>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-24 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-xl font-bold text-ink-900 dark:text-white tracking-tight">
                  {formatPrice(data?.ondo?.price)}
                </p>
                <p className={`text-xs font-medium mt-1 ${(data?.ondo?.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatChange(data?.ondo?.change24h)} 24h
                </p>
                <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1">via CoinGecko</p>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-ink-400 dark:text-ink-500 mt-6">
          These yields are factored into AI rebalancing when CSPR concentration exceeds 70%
        </p>
      </div>
    </section>
  )
}
