'use client'

import { useEffect, useState } from 'react'
import { Activity, Check, Loader2, Terminal } from 'lucide-react'

export interface ActivityStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'complete' | 'error'
  detail?: string
  timestamp?: Date
}

interface AgentActivityLogProps {
  steps: ActivityStep[]
}

export const AgentActivityLog = ({ steps }: AgentActivityLogProps) => {
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set())

  useEffect(() => {
    steps.forEach((step, i) => {
      if (step.status !== 'pending') {
        setTimeout(() => {
          setVisibleSteps(prev => new Set([...prev, step.id]))
        }, i * 120)
      }
    })
  }, [steps])

  return (
    <div className="relative bg-white border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-slate-900">Agent Activity Log</h2>
          <Activity className="w-3 h-3 text-green-500 animate-pulse ml-auto" />
        </div>

        <div className="space-y-3">
          {steps.map((step) => {
            const isVisible = visibleSteps.has(step.id)
            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {step.status === 'pending' && (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  {step.status === 'active' && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                  {step.status === 'complete' && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {step.status === 'error' && (
                    <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 flex items-center justify-center">
                      <span className="text-[8px] text-red-500 font-bold">!</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${
                    step.status === 'complete' ? 'text-slate-700' :
                    step.status === 'active' ? 'text-primary' :
                    step.status === 'error' ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.detail && (
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {step.detail}
                    </p>
                  )}
                </div>

                {step.timestamp && (
                  <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                    {step.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
  )
}
