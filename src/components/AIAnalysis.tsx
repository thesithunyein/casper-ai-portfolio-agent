'use client'

import { AIAnalysis } from '@/lib/casper'
import { ExternalLink } from 'lucide-react'

interface AIAnalysisProps {
  analysis: AIAnalysis
}

export const AIAnalysisComponent = ({ analysis }: AIAnalysisProps) => {
  const sourceLabel =
    analysis.analysisSource === 'openai'
      ? 'OpenAI GPT-4o'
      : analysis.analysisSource === 'claude'
        ? 'Claude 3.5 Sonnet'
        : 'Heuristic fallback'

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary */}
      <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">Analysis</h2>
          <span className="text-xs font-mono text-primary bg-primary/5 border border-primary/10 px-1.5 py-0.5 rounded">{sourceLabel}</span>
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{analysis.summary}</p>

        {/* RWA Exposure Badge */}
        {typeof analysis.rwaExposurePercent === 'number' && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-600">RWA</span>
                <span className="text-xs text-ink-500 dark:text-ink-400">Recommended allocation</span>
              </div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">{analysis.rwaExposurePercent}%</span>
            </div>
            <div className="mt-2 w-full bg-ink-100 dark:bg-ink-800 rounded h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded transition-all duration-500"
                style={{ width: `${analysis.rwaExposurePercent}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-ink-400 dark:text-ink-500">
              Live RWA feed: Treasury.gov T-bill yields + CoinGecko PAXG/ONDO prices.
            </p>
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      <div className="bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm">
        <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-2 tracking-tight">Risk Assessment</h2>
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm">
        <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-3 tracking-tight">Recommendations</h2>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
              <span className="flex-shrink-0 w-5 h-5 bg-primary/5 text-primary flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 rounded">{idx + 1}</span>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 shadow-stripe-sm">
        <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-3 tracking-tight">Rebalancing</h2>
        <div className="space-y-3">
          <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
            <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Action</p>
            <p className="text-sm text-ink-900 dark:text-white font-medium">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-2 tracking-wider">Target Allocation</p>
            <div className="space-y-2">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-3">
                  <span className="text-sm text-ink-900 dark:text-white font-medium w-12">{asset}</span>
                  <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
            <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Reasoning</p>
            <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>

      {/* x402 Micropayment */}
      {(analysis.x402Status || analysis.x402Payment) && (
        <div className="bg-white dark:bg-ink-900 border border-sky-200 dark:border-sky-500/20 rounded-xl p-5 shadow-stripe-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">x402 Micropayment</h2>
            <span className="text-[10px] font-mono text-sky-600 bg-sky-500/5 border border-sky-500/20 px-1.5 py-0.5 rounded">
              {analysis.x402Status === 'settled' ? 'SETTLED ON-CHAIN' : analysis.x402Status === 'verified' ? 'VERIFIED' : 'OPTIONAL'}
            </span>
          </div>
          {analysis.x402Payment ? (
            <div className="space-y-2">
              <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
                <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Amount</p>
                <p className="text-sm text-ink-900 dark:text-white font-medium">{analysis.x402Payment.amountCspr} CSPR</p>
              </div>
              <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
                <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Mode</p>
                <p className="text-xs font-mono text-ink-600 dark:text-ink-300">
                  {analysis.x402Payment.mode === 'facilitator' ? 'HTTP facilitator settle' : 'Agent-wallet native transfer'}
                </p>
              </div>
              {analysis.x402Payment.explorerUrl && (
                <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
                  <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Settlement Tx</p>
                  <a
                    href={analysis.x402Payment.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-600 font-mono text-xs break-all hover:underline"
                  >
                    {analysis.x402Payment.transactionHash}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Payment header structurally verified. Configure the agent key to produce a settled on-chain micropayment.
            </p>
          )}
        </div>
      )}

      {/* On-chain Record */}
      {analysis.onchain && (
        <div className="bg-white dark:bg-ink-900 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5 shadow-stripe-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">On-Chain Record</h2>
            <span className="text-[10px] font-mono text-emerald-600">{analysis.onchain.network}</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
              <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Transaction</p>
              <a
                href={analysis.onchain.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-600 font-mono text-xs break-all hover:underline"
              >
                {analysis.onchain.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
              <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Entry Point</p>
              <p className="text-xs font-mono text-ink-600 dark:text-ink-300">
                {analysis.onchain.entryPoint} @ {analysis.onchain.contractPackageHash.slice(0, 20)}…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Action */}
      {analysis.autonomousAction && (
        <div className="bg-white dark:bg-ink-900 border border-violet-200 dark:border-violet-500/20 rounded-xl p-5 shadow-stripe-sm">
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-3 tracking-tight">Autonomous Action</h2>
          <div className="space-y-2">
            <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
              <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Transaction</p>
              <a
                href={analysis.autonomousAction.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-violet-600 font-mono text-xs break-all hover:underline"
              >
                {analysis.autonomousAction.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg">
              <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase mb-1 tracking-wider">Action</p>
              <p className="text-xs font-mono text-ink-600 dark:text-ink-300">Native CSPR transfer (1 CSPR)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
