'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Portfolio, AIAnalysis } from '@/lib/casper'
import { AppShell } from '@/components/AppShell'
import { ExternalLink } from 'lucide-react'

interface ResultsDashboardProps {
  portfolio: Portfolio
  analysis: AIAnalysis
  walletAddress: string
  error?: string | null
  onReset: () => void
  onRetry?: () => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 + i * 0.06,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])
  return value
}

/** Clean results view — live atmosphere + staged reveal. */
export const ResultsDashboard = ({
  portfolio,
  analysis,
  walletAddress,
  error,
  onReset,
  onRetry,
}: ResultsDashboardProps) => {
  const risk =
    analysis.riskAssessment?.toLowerCase().includes('high')
      ? 'High'
      : analysis.riskAssessment?.toLowerCase().includes('low')
        ? 'Low'
        : 'Medium'

  const displayValue = useCountUp(portfolio.totalValue)

  return (
    <AppShell
      onLogoClick={onReset}
      rightSlot={
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-900 dark:hover:text-white transition-colors"
        >
          New analysis
        </button>
      }
    >
      <div className="w-full max-w-2xl mx-auto space-y-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-red-200/80 dark:border-red-500/20 bg-red-50/80 dark:bg-red-500/10 px-4 py-3 backdrop-blur-sm"
          >
            <p className="flex-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                Retry
              </button>
            )}
          </motion.div>
        )}

        <motion.header
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center pt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/70 dark:bg-ink-900/70 border border-emerald-200/60 dark:border-emerald-500/20 shadow-stripe-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Analysis complete
            </span>
          </div>
          <p className="text-[11px] font-mono text-ink-400 dark:text-ink-500 mb-2 uppercase tracking-wider">
            Portfolio value
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-ink-900 dark:text-white tracking-tight tabular-nums">
            $
            {displayValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
          <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
            Risk {risk}
            {analysis.analysisSource
              ? ` · ${
                  analysis.analysisSource === 'openai'
                    ? 'GPT'
                    : analysis.analysisSource === 'claude'
                      ? 'Claude'
                      : 'Heuristic'
                }`
              : ''}
            {portfolio.isLiveData ? ' · Live' : ' · Demo'}
          </p>
          <p className="mt-2 font-mono text-[10px] text-ink-400 dark:text-ink-500 truncate">
            {walletAddress.slice(0, 14)}…{walletAddress.slice(-10)}
          </p>
        </motion.header>

        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-2"
        >
          <ProofChip
            label="x402"
            value={
              analysis.x402Status === 'settled'
                ? 'Settled'
                : analysis.x402Status === 'verified'
                  ? 'Verified'
                  : 'Optional'
            }
            ok={analysis.x402Status === 'settled'}
            href={analysis.x402Payment?.explorerUrl}
          />
          <ProofChip
            label="On-chain"
            value={
              analysis.onchain
                ? 'store_analysis'
                : analysis.onchainError
                  ? 'Failed'
                  : 'Skipped'
            }
            ok={Boolean(analysis.onchain)}
            href={analysis.onchain?.explorerUrl}
          />
          {analysis.reputation && (
            <ProofChip
              label="Reputation"
              value={`${analysis.reputation.grade} · ${analysis.reputation.score}`}
              ok={analysis.reputation.score >= 70}
            />
          )}
        </motion.div>

        <motion.section
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-[11px] font-mono uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-4 text-center">
            Holdings
          </h2>
          <ul className="space-y-1">
            {portfolio.assets.map((asset, i) => (
              <motion.li
                key={asset.denom}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
                className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-xl hover:bg-white/50 dark:hover:bg-ink-900/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-white/80 dark:bg-ink-900/80 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-xs font-semibold text-primary shrink-0 backdrop-blur-sm">
                    {asset.symbol[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 dark:text-white">
                      {asset.symbol}
                    </p>
                    <p className="text-[11px] font-mono text-ink-400 truncate">
                      {asset.balance.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-ink-900 dark:text-white tabular-nums">
                    $
                    {asset.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="mt-1 h-1 w-16 ml-auto rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, asset.percentage)}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center px-2"
        >
          <h2 className="text-[11px] font-mono uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-3">
            Insight
          </h2>
          <p className="text-sm md:text-[15px] text-ink-600 dark:text-ink-300 leading-relaxed">
            {analysis.summary}
          </p>
        </motion.section>

        {analysis.recommendations?.length > 0 && (
          <motion.section
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-4 text-center">
              Next steps
            </h2>
            <ol className="space-y-3">
              {analysis.recommendations.slice(0, 5).map((rec, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-ink-600 dark:text-ink-300 leading-relaxed"
                >
                  <span className="font-mono text-[11px] text-primary shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </motion.section>
        )}

        {analysis.onchain && (
          <motion.section
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-center pt-2 pb-6"
          >
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-3">
              On-chain proof
            </h2>
            <a
              href={analysis.onchain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:underline break-all"
            >
              {analysis.onchain.transactionHash.slice(0, 20)}…
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
            {analysis.x402Payment?.explorerUrl && (
              <div className="mt-3">
                <a
                  href={analysis.x402Payment.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-500 hover:text-primary transition-colors"
                >
                  x402 settle {analysis.x402Payment.amountCspr} CSPR
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </AppShell>
  )
}

const ProofChip = ({
  label,
  value,
  ok,
  href,
}: {
  label: string
  value: string
  ok: boolean
  href?: string
}) => {
  const inner = (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 ${
        ok
          ? 'bg-emerald-50/90 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          : 'bg-white/70 dark:bg-ink-900/70 border-black/[0.06] dark:border-white/[0.08] text-ink-600 dark:text-ink-300'
      }`}
    >
      <span className="font-mono text-ink-400 dark:text-ink-500">{label}</span>
      <span className="font-semibold">{value}</span>
      {href && <ExternalLink className="w-3 h-3 opacity-50" />}
    </span>
  )
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  )
}
