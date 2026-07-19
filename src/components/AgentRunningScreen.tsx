'use client'

import { motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'

interface AgentRunningScreenProps {
  onCancel?: () => void
}

/** Minimal full-viewport running state — live atmosphere + calm headline. */
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
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/70 dark:bg-ink-900/70 border border-black/[0.06] dark:border-white/[0.08] shadow-stripe-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300">
            Agent running
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl md:text-[32px] font-semibold text-ink-900 dark:text-white tracking-tight"
        >
          Working on your portfolio
        </motion.h1>
      </div>
    </AppShell>
  )
}
