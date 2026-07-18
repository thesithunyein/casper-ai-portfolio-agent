'use client'

import { Github, Twitter, MessageCircle } from 'lucide-react'

export const AppFooter = () => {
  return (
    <footer className="relative z-10 bg-white dark:bg-ink-950 border-t border-black/[0.06] dark:border-white/[0.06] py-10 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-ink-900 dark:text-white tracking-tight">Casper AI Portfolio Agent</p>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-1">
              Casper Agentic Buildathon 2026 · Final Round
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://x.com/CasperAgentAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-ink-50 dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:bg-ink-100 dark:hover:bg-ink-800 transition-all duration-300"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X / Twitter</span>
            </a>
            <a
              href="https://t.me/casperagent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-ink-50 dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:bg-ink-100 dark:hover:bg-ink-800 transition-all duration-300"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
            <a
              href="https://github.com/thesithunyein/casper-ai-portfolio-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-ink-50 dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:bg-ink-100 dark:hover:bg-ink-800 transition-all duration-300"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-ink-400 dark:text-ink-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Testnet Live
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              x402 Settle
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300"
            >
              Contract
            </a>
            <span className="text-ink-300 dark:text-ink-700">|</span>
            <a
              href="https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300"
            >
              Proof of Write
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
