'use client'

import { useEffect, useRef, useState } from 'react'
import { Activity, Check, Loader2, Terminal, X, AlertTriangle, Gem } from 'lucide-react'

export interface ActivityStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'complete' | 'error'
  detail?: string
  timestamp?: Date
}

export interface AgentStep {
  message: string
  status: 'pending' | 'success' | 'error' | 'rwa'
  timestamp: string
}

interface AgentActivityLogProps {
  steps: AgentStep[]
  isRunning?: boolean
}

export const AgentActivityLog = ({ steps, isRunning = false }: AgentActivityLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (steps.length === 0) {
      setVisibleCount(0)
      return
    }
    const timers: NodeJS.Timeout[] = []
    for (let i = visibleCount; i < steps.length; i++) {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1)
        }, (i - visibleCount) * 300)
      )
    }
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleCount])

  const getStatusIcon = (status: AgentStep['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
      case 'success':
        return <Check className="w-3 h-3 text-emerald-400" />
      case 'error':
        return <X className="w-3 h-3 text-red-400" />
      case 'rwa':
        return <Gem className="w-3 h-3 text-amber-400" />
      default:
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />
    }
  }

  const getStatusColor = (status: AgentStep['status']) => {
    switch (status) {
      case 'pending':
        return 'text-slate-400'
      case 'success':
        return 'text-emerald-400'
      case 'error':
        return 'text-red-400'
      case 'rwa':
        return 'text-amber-400'
      default:
        return 'text-slate-300'
    }
  }

  if (steps.length === 0 && !isRunning) return null

  return (
    <div className="relative bg-[#0a0a0f] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-[#0a0a0f]">
        <Terminal className="w-4 h-4 text-slate-300" />
        <h2 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
          Agent Activity Log
        </h2>
        {isRunning && (
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse ml-auto" />
        )}
      </div>

      {/* Log body */}
      <div
        ref={scrollRef}
        className="px-4 py-3 space-y-1 max-h-80 overflow-y-auto font-mono text-[11px] leading-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {steps.slice(0, visibleCount).map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="text-sky-500 flex-shrink-0 whitespace-nowrap">
              [{step.timestamp}]
            </span>
            <span className="flex-shrink-0 mt-0.5">{getStatusIcon(step.status)}</span>
            <span className={`${getStatusColor(step.status)} break-words`}>
              {step.message}
            </span>
          </div>
        ))}
        {isRunning && visibleCount >= steps.length && steps.length > 0 && (
          <div className="flex items-center gap-2 text-slate-500 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Waiting for next step...</span>
          </div>
        )}
      </div>
    </div>
  )
}
