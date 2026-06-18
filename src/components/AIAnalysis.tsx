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
      <div className="relative bg-white border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Analysis</h2>
          <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">{sourceLabel}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{analysis.summary}</p>

        {/* RWA Exposure Badge */}
        {typeof analysis.rwaExposurePercent === 'number' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-600">RWA</span>
                <span className="text-xs text-slate-500">Recommended allocation</span>
              </div>
              <span className="text-sm font-semibold text-amber-700">{analysis.rwaExposurePercent}%</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded transition-all duration-500"
                style={{ width: `${analysis.rwaExposurePercent}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              Simulated RWA feed: tokenized T-bills, gold, and equities for uncorrelated exposure.
            </p>
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Risk Assessment</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Recommendations</h2>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-slate-50 border border-border rounded-lg">
              <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 rounded">{idx + 1}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Rebalancing</h2>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-border rounded-lg">
            <p className="text-[10px] font-mono text-muted uppercase mb-1">Action</p>
            <p className="text-sm text-slate-900 font-medium">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-muted uppercase mb-2">Target Allocation</p>
            <div className="space-y-2">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-3">
                  <span className="text-sm text-slate-900 font-medium w-12">{asset}</span>
                  <div className="flex-1 bg-slate-100 rounded h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-border rounded-lg">
            <p className="text-[10px] font-mono text-muted uppercase mb-1">Reasoning</p>
            <p className="text-sm text-slate-600 leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>

      {/* On-chain Record */}
      {analysis.onchain && (
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">On-Chain Record</h2>
            <span className="text-[10px] font-mono text-green-600">{analysis.onchain.network}</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-border rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Transaction</p>
              <a
                href={analysis.onchain.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green-600 font-mono text-xs break-all hover:underline"
              >
                {analysis.onchain.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-slate-50 border border-border rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Entry Point</p>
              <p className="text-xs font-mono text-slate-600">
                {analysis.onchain.entryPoint} @ {analysis.onchain.contractPackageHash.slice(0, 20)}…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Action */}
      {analysis.autonomousAction && (
        <div className="bg-white border border-violet-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Autonomous Action</h2>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-border rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Transaction</p>
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
            <div className="p-3 bg-slate-50 border border-border rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Action</p>
              <p className="text-xs font-mono text-slate-600">Native CSPR transfer (1 CSPR)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
