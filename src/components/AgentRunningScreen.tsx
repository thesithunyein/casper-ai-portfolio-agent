'use client'

import { motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'

interface AgentRunningScreenProps {
  onCancel?: () => void
}

/** Calm running state — cursor light still live in the shell. */
export const AgentRunningScreen = ({ onCancel }: AgentRunningScreenProps) => {
  return (
    <AppShell
      centered
      rightSlot={
        onCancel ? (
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 text-[13px] font-medium text-ink-400 hover:text-ink-900 dark:hover:text-white rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-300"
          >
            Cancel
          </button>
        ) : undefined
      }
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-9 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-55" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-ink-600 dark:text-ink-300">
            Agent running
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[28px] md:text-[34px] font-semibold text-ink-900 dark:text-white tracking-[-0.03em] leading-tight"
        >
          Working on your portfolio
        </motion.h1>
      </div>
    </AppShell>
  )
}
