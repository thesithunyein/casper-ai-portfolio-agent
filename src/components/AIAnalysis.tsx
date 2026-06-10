'use client'

import { AIAnalysis } from '@/lib/casper'
import { Brain, AlertTriangle, Target, Lightbulb, Sparkles, Heart, Star, Zap } from 'lucide-react'

interface AIAnalysisProps {
  analysis: AIAnalysis
}

export const AIAnalysisComponent = ({ analysis }: AIAnalysisProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-black">AI Analysis</h2>
              <Sparkles className="w-4 h-4 text-cute-dark animate-pulse" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">
              {analysis.analysisSource === 'heuristic'
                ? 'Demo mode — set ANTHROPIC_API_KEY for live Claude 3.5 Sonnet'
                : 'Portfolio summary by Claude 3.5 Sonnet'}
            </p>
          </div>
        </div>
        <p className="text-gray-800 leading-relaxed text-lg">{analysis.summary}</p>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-black">Risk Assessment</h3>
              <Heart className="w-4 h-4 text-cute-dark animate-pulse" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Current portfolio risk profile</p>
          </div>
        </div>
        <p className="text-gray-800 leading-relaxed">{analysis.riskAssessment}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-primary flex items-center justify-center shadow-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-black">Recommendations</h3>
              <Star className="w-4 h-4 text-cute-dark animate-bounce" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">AI-generated actionable insights</p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex gap-4 p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-cute/30 hover:bg-white transition-all hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <span className="text-xs font-mono text-white font-bold">{idx + 1}</span>
              </div>
              <p className="text-gray-800 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-black">Rebalancing Suggestion</h3>
              <Zap className="w-4 h-4 text-cute-dark animate-pulse" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Optimal target allocation</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 font-semibold">Action</p>
            <p className="text-black font-bold">{analysis.rebalancingSuggestion.action}</p>
          </div>

          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4 font-semibold">Target Allocation</p>
            <div className="space-y-3">
              {Object.entries(analysis.rebalancingSuggestion.targetAllocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center gap-4">
                  <span className="text-black font-bold w-16">{asset}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary via-cute-dark to-secondary h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-primary font-mono w-12 text-right font-bold">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 font-semibold">Reasoning</p>
            <p className="text-gray-800 leading-relaxed">{analysis.rebalancingSuggestion.reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
