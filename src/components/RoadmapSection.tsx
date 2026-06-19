'use client'

import { Check, Clock, Rocket } from 'lucide-react'

interface RoadmapItem {
  phase: string
  title: string
  desc: string
  status: 'done' | 'in-progress' | 'upcoming'
}

const ROADMAP: RoadmapItem[] = [
  {
    phase: 'Q2 2026',
    title: 'MVP on Casper Testnet',
    desc: 'Portfolio analysis, x402 micropayments, Odra smart contract, and autonomous rebalancing.',
    status: 'done',
  },
  {
    phase: 'Q3 2026',
    title: 'RWA Oracle Integration',
    desc: 'Tokenized T-bills, gold, and equities priced on-chain for true diversification advice.',
    status: 'in-progress',
  },
  {
    phase: 'Q3 2026',
    title: 'Live x402 Facilitator',
    desc: 'Real micropayment settlement on Casper Mainnet via the official x402 facilitator.',
    status: 'upcoming',
  },
  {
    phase: 'Q4 2026',
    title: 'Mainnet Deployment',
    desc: 'Full production launch with audited Odra contracts and institutional-grade security.',
    status: 'upcoming',
  },
  {
    phase: 'Q1 2027',
    title: 'Multi-Agent Mesh',
    desc: 'Multiple specialized agents (yield, risk, macro) coordinating via x402 payments.',
    status: 'upcoming',
  },
]

export const RoadmapSection = () => {
  return (
    <section id="roadmap" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">Roadmap</h2>
          <p className="text-base text-ink-500 dark:text-ink-400 max-w-md mx-auto">
            Where we are headed — from hackathon MVP to a full agentic portfolio mesh.
          </p>
        </div>

        <div className="space-y-3">
          {ROADMAP.map((item, i) => (
            <div
              key={i}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative flex items-start gap-4 bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-5 hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:shadow-stripe-md transition-all duration-300">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.status === 'done'
                    ? 'bg-emerald-50 border border-emerald-100'
                    : item.status === 'in-progress'
                      ? 'bg-primary/5 border border-primary/10'
                      : 'bg-ink-50 dark:bg-ink-800 border border-black/[0.06] dark:border-white/[0.06]'
                }`}>
                  {item.status === 'done' && <Check className="w-4 h-4 text-emerald-600" />}
                  {item.status === 'in-progress' && <Clock className="w-4 h-4 text-primary animate-pulse" />}
                  {item.status === 'upcoming' && <Rocket className="w-4 h-4 text-ink-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === 'done'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : item.status === 'in-progress'
                          ? 'bg-primary/5 text-primary border border-primary/10'
                          : 'bg-ink-50 dark:bg-ink-800 text-ink-500 dark:text-ink-400 border border-black/[0.06] dark:border-white/[0.06]'
                    }`}>
                      {item.phase}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      item.status === 'done'
                        ? 'text-emerald-600'
                        : item.status === 'in-progress'
                          ? 'text-primary'
                          : 'text-ink-400'
                    }`}>
                      {item.status === 'done' ? 'Shipped' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
