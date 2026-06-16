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
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-500" />
        <div className="relative bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Analysis</h2>
            <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-1.5 py-0.5 rounded">{sourceLabel}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-2">Risk Assessment</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Recommendations</h2>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
              <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 text-white flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 rounded">{idx + 1}</span>
              <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Rebalancing</h2>
        <div className="space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-[10px] font-mono text-muted uppercase mb-1">Action</p>
            <p className="text-sm text-white font-medium">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-muted uppercase mb-2">Target Allocation</p>
            <div className="space-y-2">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-3">
                  <span className="text-sm text-white font-medium w-12">{asset}</span>
                  <div className="flex-1 bg-white/10 rounded h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-neon-cyan to-neon-purple h-full rounded transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-[10px] font-mono text-muted uppercase mb-1">Reasoning</p>
            <p className="text-sm text-gray-300 leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>

      {/* On-chain Record */}
      {analysis.onchain && (
        <div className="bg-galaxy-800/80 backdrop-blur-md border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">On-Chain Record</h2>
            <span className="text-[10px] font-mono text-green-400">{analysis.onchain.network}</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Transaction</p>
              <a
                href={analysis.onchain.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green-400 font-mono text-xs break-all hover:underline"
              >
                {analysis.onchain.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Entry Point</p>
              <p className="text-xs font-mono text-gray-300">
                {analysis.onchain.entryPoint} @ {analysis.onchain.contractPackageHash.slice(0, 20)}…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Action */}
      {analysis.autonomousAction && (
        <div className="bg-galaxy-800/80 backdrop-blur-md border border-neon-purple/30 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Autonomous Action</h2>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Transaction</p>
              <a
                href={analysis.autonomousAction.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neon-purple font-mono text-xs break-all hover:underline"
              >
                {analysis.autonomousAction.transactionHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-[10px] font-mono text-muted uppercase mb-1">Action</p>
              <p className="text-xs font-mono text-gray-300">Native CSPR transfer (1 CSPR)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
