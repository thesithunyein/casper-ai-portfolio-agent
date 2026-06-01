'use client'

import { AIAnalysis } from '@/lib/ai'
import { Brain, AlertTriangle, Target, Lightbulb } from 'lucide-react'

interface AIAnalysisProps {
  analysis: AIAnalysis
}

export const AIAnalysisComponent = ({ analysis }: AIAnalysisProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">AI Analysis</h2>
            <p className="text-gray-600 text-sm">Portfolio summary by Claude AI</p>
          </div>
        </div>
        <p className="text-gray-800 leading-relaxed text-lg">{analysis.summary}</p>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-black">Risk Assessment</h3>
            <p className="text-gray-600 text-sm">Current portfolio risk profile</p>
          </div>
        </div>
        <p className="text-gray-800 leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-black">Recommendations</h3>
            <p className="text-gray-600 text-sm">AI-generated actionable insights</p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-mono text-primary font-bold">{idx + 1}</span>
              </div>
              <p className="text-gray-800 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-black">Rebalancing Suggestion</h3>
            <p className="text-gray-600 text-sm">Optimal target allocation</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-2">Action</p>
            <p className="text-black font-medium">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-4">Target Allocation</p>
            <div className="space-y-3">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-4">
                  <span className="text-black font-medium w-16">{asset}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-primary font-mono w-12 text-right font-bold">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-2">Reasoning</p>
            <p className="text-gray-800 leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
