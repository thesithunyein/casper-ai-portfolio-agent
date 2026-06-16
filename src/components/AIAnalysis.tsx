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
      <div className="bg-surface border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-black">Analysis</h2>
          <span className="text-xs font-mono text-muted bg-surface-alt border border-border px-1.5 py-0.5">{sourceLabel}</span>
        </div>
        <p className="text-sm text-black leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Risk Assessment */}
      <div className="bg-surface border border-border p-4">
        <h2 className="text-sm font-semibold text-black mb-2">Risk Assessment</h2>
        <p className="text-sm text-black leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-surface border border-border p-4">
        <h2 className="text-sm font-semibold text-black mb-3">Recommendations</h2>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-surface-alt border border-border">
              <span className="flex-shrink-0 w-5 h-5 bg-black text-white flex items-center justify-center text-[10px] font-mono font-bold mt-0.5">{idx + 1}</span>
              <p className="text-sm text-black leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="bg-surface border border-border p-4">
        <h2 className="text-sm font-semibold text-black mb-3">Rebalancing</h2>
        <div className="space-y-3">
          <div className="p-3 bg-surface-alt border border-border">
            <p className="text-[10px] font-mono text-muted uppercase mb-1">Action</p>
            <p className="text-sm text-black font-medium">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-muted uppercase mb-2">Target Allocation</p>
            <div className="space-y-2">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-3">
                  <span className="text-sm text-black font-medium w-12">{asset}</span>
                  <div className="flex-1 bg-surface-alt border border-border h-2 overflow-hidden">
                    <div className="bg-black h-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-surface-alt border border-border">
            <p className="text-[10px] font-mono text-muted uppercase mb-1">Reasoning</p>
            <p className="text-sm text-black leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>

      {/* On-chain Record */}
      {analysis.onchain && (
        <div className="bg-surface border border-green-600/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-black">On-Chain Record</h2>
            <span className="text-[10px] font-mono text-muted">{analysis.onchain.network}</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-surface-alt border border-border">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Transaction</p>
              <a
                href={analysis.onchain.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green-700 font-mono text-xs break-all hover:underline"
              >
                {analysis.onchain.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-surface-alt border border-border">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Entry Point</p>
              <p className="text-xs font-mono text-black">
                {analysis.onchain.entryPoint} @ {analysis.onchain.contractPackageHash.slice(0, 20)}…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Action */}
      {analysis.autonomousAction && (
        <div className="bg-surface border border-purple-600/30 p-4">
          <h2 className="text-sm font-semibold text-black mb-3">Autonomous Action</h2>
          <div className="space-y-2">
            <div className="p-3 bg-surface-alt border border-border">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Transaction</p>
              <a
                href={analysis.autonomousAction.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-purple-700 font-mono text-xs break-all hover:underline"
              >
                {analysis.autonomousAction.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-surface-alt border border-border">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Action</p>
              <p className="text-xs font-mono text-black">Native CSPR transfer (1 CSPR)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
