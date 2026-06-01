'use client'

import { AIAnalysis } from '@/lib/ai'
import { Brain, AlertTriangle, Target, Lightbulb, BarChart3 } from 'lucide-react'

interface AIAnalysisProps {
  analysis: AIAnalysis
}

export const AIAnalysisComponent = ({ analysis }: AIAnalysisProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Analysis</h2>
            <p className="text-gray-500 text-sm">Portfolio summary by Claude AI</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed text-lg">{analysis.summary}</p>
      </div>

      {/* Risk Assessment */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Risk Assessment</h3>
            <p className="text-gray-500 text-sm">Current portfolio risk profile</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Recommendations</h3>
            <p className="text-gray-500 text-sm">AI-generated actionable insights</p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-mono text-primary">{idx + 1}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Rebalancing Suggestion</h3>
            <p className="text-gray-500 text-sm">Optimal target allocation</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Action</p>
            <p className="text-white font-medium">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">Target Allocation</p>
            <div className="space-y-3">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-4">
                  <span className="text-white font-medium w-16">{asset}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-primary font-mono w-12 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Reasoning</p>
            <p className="text-gray-300 leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
