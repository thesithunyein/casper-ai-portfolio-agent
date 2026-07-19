'use client'

import { AppShell } from '@/components/AppShell'

interface AgentRunningScreenProps {
  onCancel?: () => void
}

/** Minimal full-viewport running state — headline only until results are ready. */
export const AgentRunningScreen = ({ onCancel }: AgentRunningScreenProps) => {
  return (
    <AppShell
      centered
      rightSlot={
        onCancel ? (
          <button
            onClick={onCancel}
            className="text-[13px] font-medium text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        ) : undefined
      }
    >
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/80 dark:bg-ink-900/80 border border-black/[0.06] dark:border-white/[0.08] shadow-stripe-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300">
            Agent running
          </span>
        </div>

        <h1 className="text-2xl md:text-[32px] font-semibold text-ink-900 dark:text-white tracking-tight">
          Working on your portfolio
        </h1>
      </div>
    </AppShell>
  )
}
