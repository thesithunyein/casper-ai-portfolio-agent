'use client'

import { ShieldCheck } from 'lucide-react'

/**
 * Sticky judge strip — makes Final Round verification impossible to miss.
 */
export const JudgeBanner = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-emerald-500/30 bg-ink-950/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-emerald-400 flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[11px] font-semibold tracking-wide uppercase">
            Judges
          </span>
        </div>
        <p className="text-[11px] text-ink-300 leading-snug flex-1">
          Demo account → Analyze → check x402 settle + on-chain tx + reputation. Proof pack on page.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="#proof"
            className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-500 text-ink-950 hover:bg-emerald-400 transition-colors"
          >
            Proof
          </a>
          <a
            href="#wallet-section"
            className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-white/15 text-white hover:bg-white/5 transition-colors"
          >
            Try demo
          </a>
          <a
            href="/api/agent-status"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-white/15 text-white hover:bg-white/5 transition-colors"
          >
            Status
          </a>
        </div>
      </div>
    </div>
  )
}
