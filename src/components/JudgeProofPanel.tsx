'use client'

import { ExternalLink, ShieldCheck, FileCode2, Activity } from 'lucide-react'

const PROOFS = [
  {
    label: 'Contract package hash',
    value: '2f76596281bab4993440f5bd88728a34faa1031ab4b7ce8e0064219e1ae2e03d',
    href: 'https://testnet.cspr.live/contract-package/2f76596281bab4993440f5bd88728a34faa1031ab4b7ce8e0064219e1ae2e03d',
  },
  {
    label: 'Deployed contract',
    value: '0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6',
    href: 'https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6',
  },
  {
    label: 'Sample store_analysis tx',
    value: 'cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779',
    href: 'https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779',
    note: 'Successful PortfolioAgent.store_analysis call on Casper Testnet',
  },
  {
    label: 'Contract install tx',
    value: '9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a',
    href: 'https://testnet.cspr.live/transaction/9460c0d39fe20ee75efcf768e6b7bb2f3a5597aff956e5eea141312b22a2dc0a',
    note: 'Odra PortfolioAgent install on Testnet',
  },
]

/** On-chain verification — product-grade proof surface (also used by Final Round reviewers). */
export const JudgeProofPanel = () => {
  return (
    <section id="proof" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verifiable on Testnet
          </div>
          <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">
            On-chain proof
          </h2>
          <p className="text-base text-ink-500 dark:text-ink-400 max-w-xl mx-auto">
            Package hash and sample transactions — open any link on cspr.live to verify.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {PROOFS.map((item) => (
            <a
              key={item.value}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 hover:shadow-stripe-md hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider">
                  {item.label}
                </p>
                <ExternalLink className="w-3.5 h-3.5 text-ink-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              </div>
              <p className="font-mono text-xs text-ink-900 dark:text-white break-all leading-relaxed">
                {item.value}
              </p>
              {item.note && (
                <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">{item.note}</p>
              )}
            </a>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://github.com/thesithunyein/casper-ai-portfolio-agent/blob/main/JUDGE_PLAYBOOK.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-ink-50 dark:bg-ink-800/40 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-4 hover:border-primary/30 transition-colors"
          >
            <FileCode2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-white">Quick verify guide</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">60-second path with demo account</p>
            </div>
          </a>
          <a
            href="https://github.com/thesithunyein/casper-ai-portfolio-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-ink-50 dark:bg-ink-800/40 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-4 hover:border-primary/30 transition-colors"
          >
            <Activity className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-white">Source code</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">Open-source on GitHub</p>
            </div>
          </a>
          <a
            href="/api/agent-status"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-ink-50 dark:bg-ink-800/40 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-4 hover:border-primary/30 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-white">Agent status</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">Live diagnostics (no secrets)</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
