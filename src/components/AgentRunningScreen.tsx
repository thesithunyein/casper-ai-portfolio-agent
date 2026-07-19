'use client'

import { Logo } from '@/components/Logo'

interface AgentRunningScreenProps {
  onCancel?: () => void
}

/** Minimal full-viewport running state — headline only until results are ready. */
export const AgentRunningScreen = ({ onCancel }: AgentRunningScreenProps) => {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-ink-50 dark:bg-ink-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,91,255,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(16,185,129,0.08), transparent 50%)',
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-16">
        <div className="flex items-center gap-2.5">
          <Logo className="w-7 h-7" />
          <span className="font-semibold text-[15px] text-ink-900 dark:text-white tracking-tight">
            Casper Agent
          </span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-[13px] font-medium text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
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
      </div>
    </main>
  )
}
