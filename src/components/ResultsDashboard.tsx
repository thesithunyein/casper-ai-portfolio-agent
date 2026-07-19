'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Portfolio, AIAnalysis } from '@/lib/casper'
import { AppShell } from '@/components/AppShell'
import { SpotlightCard } from '@/components/PointerEffects'
import { BuiltOnCasper } from '@/components/BuiltOnCasper'
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
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.08 + i * 0.07,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function useCountUp(target: number, durationMs = 1100) {
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

/** Results — staged reveal with cursor-reactive chips and holdings. */
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
          className="px-3.5 py-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-900 dark:hover:text-white rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-300"
        >
          New analysis
        </button>
      }
    >
      <div className="w-full max-w-2xl mx-auto space-y-11">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-[16px] border border-red-200/70 dark:border-red-500/20 bg-red-50/70 dark:bg-red-500/10 px-4 py-3.5 backdrop-blur-xl"
          >
            <p className="flex-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-[13px] font-semibold text-ink-900 dark:text-primary hover:opacity-80 transition-opacity"
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
          className="text-center pt-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-7 rounded-full bg-white/70 dark:bg-white/[0.06] border border-primary/40 dark:border-primary/25 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary ring-1 ring-primary-ink/20" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-ink-700 dark:text-primary">
              Analysis complete
            </span>
          </div>
          <p className="text-[11px] font-medium text-ink-400 dark:text-ink-500 mb-2.5 tracking-[0.12em] uppercase">
            Portfolio value
          </p>
          <h1 className="text-[40px] md:text-[56px] font-semibold text-ink-900 dark:text-white tracking-[-0.04em] tabular-nums leading-none">
            $
            {displayValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
          <p className="mt-4 text-[14px] text-ink-500 dark:text-ink-400 tracking-[-0.01em]">
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
          <p className="mt-2.5 font-mono text-[10px] text-ink-400/90 dark:text-ink-500 truncate tracking-tight">
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
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink-400 dark:text-ink-500 mb-4 text-center">
            Holdings
          </h2>
          <ul className="space-y-1.5">
            {portfolio.assets.map((asset, i) => (
              <motion.li
                key={asset.denom}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.06, duration: 0.45 }}
              >
                <SpotlightCard className="rounded-[14px] px-3.5 py-3 transition-colors hover:bg-white/55 dark:hover:bg-white/[0.04]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-full bg-primary text-primary-ink border border-primary-ink/10 flex items-center justify-center text-xs font-semibold shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                        {asset.symbol[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">
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
                      <p className="text-sm font-semibold text-ink-900 dark:text-white tabular-nums tracking-tight">
                        $
                        {asset.value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <div className="mt-1.5 h-1 w-16 ml-auto rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, asset.percentage)}%` }}
                          transition={{
                            delay: 0.45 + i * 0.08,
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
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
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink-400 dark:text-ink-500 mb-3.5">
            Insight
          </h2>
          <p className="text-[15px] text-ink-600 dark:text-ink-300 leading-[1.65] tracking-[-0.01em] max-w-xl mx-auto">
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
            <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink-400 dark:text-ink-500 mb-4 text-center">
              Next steps
            </h2>
            <ol className="space-y-3.5 max-w-xl mx-auto">
              {analysis.recommendations.slice(0, 5).map((rec, i) => (
                <li
                  key={i}
                  className="flex gap-3.5 text-[14px] text-ink-600 dark:text-ink-300 leading-relaxed tracking-[-0.01em]"
                >
                  <span className="text-[11px] font-semibold text-ink-900 dark:text-primary shrink-0 mt-0.5 tabular-nums">
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
            className="text-center pt-2 pb-8"
          >
            <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink-400 dark:text-ink-500 mb-3.5">
              On-chain proof
            </h2>
            <a
              href={analysis.onchain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-ink-900 dark:text-primary hover:opacity-80 transition-opacity break-all"
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
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-500 hover:text-ink-900 dark:hover:text-primary transition-colors"
                >
                  x402 settle {analysis.x402Payment.amountCspr} CSPR
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </motion.section>
        )}

        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-center pt-4 pb-6"
        >
          <BuiltOnCasper />
        </motion.div>
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
  const className = `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[11px] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${
    ok
      ? 'bg-primary/90 text-primary-ink border-primary-ink/10'
      : 'bg-white/70 dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.08] text-ink-600 dark:text-ink-300'
  }`

  const inner = (
    <>
      <span className="font-medium text-ink-500 dark:text-ink-400 tracking-wide">{label}</span>
      <span className="font-semibold tracking-tight">{value}</span>
      {href && <ExternalLink className="w-3 h-3 opacity-45" />}
    </>
  )

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <span className={className}>{inner}</span>
  )
}
