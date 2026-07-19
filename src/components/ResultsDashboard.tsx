'use client'

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

/** Clean results view — same quiet language as home / running. */
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
      <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-10">
        {error && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-red-200/80 dark:border-red-500/20 bg-red-50/80 dark:bg-red-500/10 px-4 py-3">
            <p className="flex-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Hero metrics */}
        <header className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/80 dark:bg-ink-900/80 border border-black/[0.06] dark:border-white/[0.08] shadow-stripe-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300">
              Analysis complete
            </span>
          </div>
          <p className="text-[11px] font-mono text-ink-400 dark:text-ink-500 mb-2 uppercase tracking-wider">
            Portfolio value
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-ink-900 dark:text-white tracking-tight tabular-nums">
            $
            {portfolio.totalValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
          <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
            Risk {risk}
            {analysis.analysisSource ? ` · ${analysis.analysisSource === 'openai' ? 'GPT' : analysis.analysisSource === 'claude' ? 'Claude' : 'Heuristic'}` : ''}
            {portfolio.isLiveData ? ' · Live' : ' · Demo'}
          </p>
          <p className="mt-2 font-mono text-[10px] text-ink-400 dark:text-ink-500 truncate">
            {walletAddress.slice(0, 14)}…{walletAddress.slice(-10)}
          </p>
        </header>

        {/* Proof chips */}
        <div className="flex flex-wrap justify-center gap-2">
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
            value={analysis.onchain ? 'store_analysis' : analysis.onchainError ? 'Failed' : 'Skipped'}
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
        </div>

        {/* Holdings */}
        <section>
          <h2 className="text-[11px] font-mono uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-4 text-center">
            Holdings
          </h2>
          <ul className="space-y-3">
            {portfolio.assets.map((asset) => (
              <li
                key={asset.denom}
                className="flex items-center justify-between gap-4 px-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {asset.symbol[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 dark:text-white">
                      {asset.symbol}
                    </p>
                    <p className="text-[11px] font-mono text-ink-400 truncate">
                      {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
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
                  <p className="text-[11px] font-mono text-ink-400">
                    {asset.percentage.toFixed(1)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Summary */}
        <section className="text-center px-2">
          <h2 className="text-[11px] font-mono uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-3">
            Insight
          </h2>
          <p className="text-sm md:text-[15px] text-ink-600 dark:text-ink-300 leading-relaxed">
            {analysis.summary}
          </p>
        </section>

        {/* Recommendations */}
        {analysis.recommendations?.length > 0 && (
          <section>
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
          </section>
        )}

        {/* On-chain proof detail */}
        {analysis.onchain && (
          <section className="text-center pt-2 pb-6">
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
          </section>
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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] ${
        ok
          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          : 'bg-white/80 dark:bg-ink-900/80 border-black/[0.06] dark:border-white/[0.08] text-ink-600 dark:text-ink-300'
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
