'use client'

import { motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'
import { WalletConnect } from '@/components/WalletConnect'
import { SpotlightCard } from '@/components/PointerEffects'
import { BookOpen, FileCode2, ShieldCheck } from 'lucide-react'

interface HomeLandingProps {
  onLogoClick?: () => void
}

const ESSENTIALS = [
  {
    label: 'Docs',
    hint: 'README & playbook',
    href: 'https://github.com/thesithunyein/casper-ai-portfolio-agent#readme',
    icon: BookOpen,
  },
  {
    label: 'Contract',
    hint: 'Odra on testnet',
    href: 'https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6',
    icon: FileCode2,
  },
  {
    label: 'Verify',
    hint: 'On-chain sample',
    href: 'https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779',
    icon: ShieldCheck,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

/** Product home — quiet hero, cursor light, essentials below. */
export const HomeLanding = ({ onLogoClick }: HomeLandingProps) => {
  return (
    <AppShell
      centered
      onLogoClick={onLogoClick}
      footer={
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg mx-auto"
        >
          <p className="text-center text-[11px] font-medium tracking-[0.14em] uppercase text-ink-400 dark:text-ink-500 mb-4">
            Essentials
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {ESSENTIALS.map((item) => (
              <SpotlightCard
                key={item.label}
                href={item.href}
                className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white/55 dark:bg-white/[0.04] backdrop-blur-xl px-3 py-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              >
                <item.icon className="w-4 h-4 mx-auto mb-2.5 text-ink-900 dark:text-primary group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[13px] font-semibold text-ink-900 dark:text-white tracking-tight">
                  {item.label}
                </p>
                <p className="mt-1 text-[10px] text-ink-400 dark:text-ink-500 leading-tight hidden sm:block">
                  {item.hint}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </motion.div>
      }
    >
      <div className="w-full max-w-[420px] mx-auto text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-9 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-55" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary ring-1 ring-primary-ink/20" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-ink-600 dark:text-ink-300">
            Live on Casper Testnet
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-[34px] md:text-[44px] font-semibold text-ink-900 dark:text-white tracking-[-0.035em] mb-3.5 leading-[1.05]"
        >
          CasperAgent
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-[15px] md:text-base text-ink-500 dark:text-ink-400 mb-11 leading-relaxed max-w-[340px] mx-auto tracking-[-0.01em]"
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
