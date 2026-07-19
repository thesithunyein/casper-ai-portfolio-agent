'use client'

import { AppShell } from '@/components/AppShell'
import { WalletConnect } from '@/components/WalletConnect'

interface HomeLandingProps {
  onLogoClick?: () => void
}

/** Minimal home — brand + one line + connect. Same language as Agent running. */
export const HomeLanding = ({ onLogoClick }: HomeLandingProps) => {
  return (
    <AppShell centered onLogoClick={onLogoClick}>
      <div className="w-full max-w-md mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/80 dark:bg-ink-900/80 border border-black/[0.06] dark:border-white/[0.08] shadow-stripe-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300">
            Live on Casper Testnet
          </span>
        </div>

        <h1 className="text-3xl md:text-[40px] font-semibold text-ink-900 dark:text-white tracking-tight mb-3">
          Casper Agent
        </h1>
        <p className="text-sm md:text-base text-ink-500 dark:text-ink-400 mb-10 leading-relaxed max-w-sm mx-auto">
          Autonomous portfolio analysis with x402 settle and on-chain proof.
        </p>

        <WalletConnect />

        <a
          href="https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 text-[12px] font-mono text-ink-400 hover:text-primary transition-colors"
        >
          Verify sample store_analysis →
        </a>
      </div>
    </AppShell>
  )
}
