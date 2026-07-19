'use client'

import { motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'
import { WalletConnect } from '@/components/WalletConnect'
import { BookOpen, FileCode2, ShieldCheck } from 'lucide-react'

interface HomeLandingProps {
  onLogoClick?: () => void
}

const ESSENTIALS = [
  {
    label: 'Docs',
    hint: 'README & judge playbook',
    href: 'https://github.com/thesithunyein/casper-ai-portfolio-agent#readme',
    icon: BookOpen,
  },
  {
    label: 'Contract',
    hint: 'Odra PortfolioAgent',
    href: 'https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6',
    icon: FileCode2,
  },
  {
    label: 'Verify',
    hint: 'Sample store_analysis',
    href: 'https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779',
    icon: ShieldCheck,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 + i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

/** Minimal home — brand + connect, live atmosphere, essentials below. */
export const HomeLanding = ({ onLogoClick }: HomeLandingProps) => {
  return (
    <AppShell
      centered
      onLogoClick={onLogoClick}
      footer={
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg mx-auto"
        >
          <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-4">
            Essentials
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {ESSENTIALS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-ink-900/40 backdrop-blur-md px-3 py-3.5 text-center transition-all duration-300 hover:border-primary/25 hover:bg-white/80 dark:hover:bg-ink-900/70 hover:-translate-y-0.5"
              >
                <item.icon className="w-4 h-4 mx-auto mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="text-[12px] font-semibold text-ink-900 dark:text-white tracking-tight">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-400 dark:text-ink-500 leading-tight hidden sm:block">
                  {item.hint}
                </p>
              </a>
            ))}
          </div>
        </motion.div>
      }
    >
      <div className="w-full max-w-md mx-auto text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/70 dark:bg-ink-900/70 border border-black/[0.06] dark:border-white/[0.08] shadow-stripe-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300">
            Live on Casper Testnet
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-3xl md:text-[42px] font-semibold text-ink-900 dark:text-white tracking-tight mb-3"
        >
          Casper Agent
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-sm md:text-base text-ink-500 dark:text-ink-400 mb-10 leading-relaxed max-w-sm mx-auto"
        >
          Autonomous portfolio analysis with x402 settle and on-chain proof.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <WalletConnect />
        </motion.div>
      </div>
    </AppShell>
  )
}
