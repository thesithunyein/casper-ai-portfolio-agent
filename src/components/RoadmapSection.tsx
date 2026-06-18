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
    <section id="roadmap" className="relative z-10 py-24 px-4 md:px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Roadmap</h2>
          <p className="text-sm text-muted max-w-md mx-auto">
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
              <div className="relative flex items-start gap-4 bg-white border border-border rounded-xl p-5 hover:border-border-strong transition-all duration-300 shadow-sm">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.status === 'done'
                    ? 'bg-green-100 border border-green-200'
                    : item.status === 'in-progress'
                      ? 'bg-blue-100 border border-blue-200'
                      : 'bg-slate-100 border border-slate-200'
                }`}>
                  {item.status === 'done' && <Check className="w-4 h-4 text-green-600" />}
                  {item.status === 'in-progress' && <Clock className="w-4 h-4 text-blue-600 animate-pulse" />}
                  {item.status === 'upcoming' && <Rocket className="w-4 h-4 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === 'done'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : item.status === 'in-progress'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {item.phase}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      item.status === 'done'
                        ? 'text-green-600'
                        : item.status === 'in-progress'
                          ? 'text-blue-600'
                          : 'text-slate-500'
                    }`}>
                      {item.status === 'done' ? 'Shipped' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
