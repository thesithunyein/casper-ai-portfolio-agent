'use client'

import { Github, Twitter, MessageCircle } from 'lucide-react'

export const AppFooter = () => {
  return (
    <footer className="relative z-10 bg-galaxy-900 border-t border-border py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-gray-300">Casper AI Portfolio Agent</p>
            <p className="text-xs text-gray-500 mt-1">
              Built for the Casper Agentic Buildathon 2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://x.com/casperagent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:border-border-strong hover:bg-surface-alt transition-all duration-300"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X / Twitter</span>
            </a>
            <a
              href="https://t.me/casperagent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:border-border-strong hover:bg-surface-alt transition-all duration-300"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
            <a
              href="https://github.com/thesithunyein/casper-ai-portfolio-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:border-border-strong hover:bg-surface-alt transition-all duration-300"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-gray-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Testnet Live
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              x402 Ready
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Contract
            </a>
            <span className="text-gray-700">|</span>
            <a
              href="https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Proof of Write
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
