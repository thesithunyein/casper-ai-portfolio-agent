'use client'

import { Logo } from '@/components/Logo'
import { AgentActivityLog } from '@/components/AgentActivityLog'
import type { AgentStep } from '@/lib/store'

interface AgentRunningScreenProps {
  steps: AgentStep[]
  walletAddress?: string | null
  onCancel?: () => void
}

const PHASES = [
  'Fetching portfolio',
  'Reading RWA oracles',
  'Settling x402',
  'Running AI analysis',
  'Writing on-chain',
]

/** Full-viewport running state — only this UI until analysis results are ready. */
export const AgentRunningScreen = ({
  steps,
  walletAddress,
  onCancel,
}: AgentRunningScreenProps) => {
  const latest = steps[steps.length - 1]
  const phaseIndex = Math.min(
    PHASES.length - 1,
    Math.floor((steps.filter((s) => s.status === 'success' || s.status === 'rwa').length / 4))
  )

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-ink-50 dark:bg-ink-950">
      {/* Soft atmospheric background */}
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-lg animate-fade-in">
          {/* Status header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/80 dark:bg-ink-900/80 border border-black/[0.06] dark:border-white/[0.08] shadow-stripe-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300">
                Agent running
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 dark:text-white tracking-tight mb-3">
              Working on your portfolio
            </h1>
            <p className="text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto leading-relaxed">
              {latest?.message || 'Connecting to Casper Testnet…'}
            </p>
            {walletAddress && (
              <p className="mt-3 font-mono text-[10px] text-ink-400 dark:text-ink-500 truncate max-w-xs mx-auto">
                {walletAddress.slice(0, 12)}…{walletAddress.slice(-8)}
              </p>
            )}
          </div>

          {/* Phase progress */}
          <div className="flex items-center justify-between gap-1 mb-8 px-1">
            {PHASES.map((phase, i) => (
              <div key={phase} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`h-1 w-full rounded-full transition-all duration-700 ${
                    i <= phaseIndex
                      ? 'bg-primary'
                      : 'bg-black/[0.06] dark:bg-white/[0.08]'
                  }`}
                />
                <span
                  className={`hidden sm:block text-[9px] font-mono text-center leading-tight ${
                    i <= phaseIndex
                      ? 'text-primary'
                      : 'text-ink-300 dark:text-ink-600'
                  }`}
                >
                  {phase}
                </span>
              </div>
            ))}
          </div>

          {/* Live log — borderless shell; log component provides chrome */}
          <div className="rounded-xl overflow-hidden shadow-stripe-md">
            <AgentActivityLog steps={steps} isRunning />
          </div>

          <p className="mt-6 text-center text-[11px] font-mono text-ink-400 dark:text-ink-500">
            Results appear when x402 settle and on-chain write complete
          </p>
        </div>
      </div>
    </main>
  )
}
