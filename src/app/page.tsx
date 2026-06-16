'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import {
  ANALYSIS_COST_CSPR,
  ANALYSIS_RECIPIENT,
  buildX402HeaderValue,
  createX402Payment,
} from '@/lib/x402'
import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioDisplay } from '@/components/PortfolioDisplay'
import { AIAnalysisComponent } from '@/components/AIAnalysis'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { Logo } from '@/components/Logo'
import { AgentChat } from '@/components/AgentChat'

export default function Home() {
  const {
    walletAddress,
    portfolio,
    analysis,
    loading,
    error,
    setPortfolio,
    setAnalysis,
    setLoading,
    setError,
    reset,
  } = useAppStore()

  const handleAnalyze = useCallback(async () => {
    if (!walletAddress) return

    setLoading(true)
    setError(null)

    try {
      // Fetch portfolio via our server route (CSPR.cloud blocks browser CORS)
      const portfolioRes = await fetch(
        `/api/portfolio?address=${encodeURIComponent(walletAddress)}`
      )
      if (!portfolioRes.ok) {
        const err = await portfolioRes.json()
        throw new Error(err.error || 'Failed to fetch portfolio')
      }
      const portfolioData = await portfolioRes.json()
      // Re-hydrate the Date that was serialized to a string over JSON
      portfolioData.lastUpdated = new Date(portfolioData.lastUpdated)
      setPortfolio(portfolioData)

      // Agent pays for its own analysis via an x402 micropayment header
      const payment = await createX402Payment(
        ANALYSIS_COST_CSPR,
        ANALYSIS_RECIPIENT,
        'Portfolio AI Analysis'
      )

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x402-payment': buildX402HeaderValue(payment),
        },
        body: JSON.stringify({ portfolio: portfolioData }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze portfolio')
      }

      const aiAnalysis = await response.json()
      setAnalysis(aiAnalysis)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [walletAddress, setPortfolio, setAnalysis, setLoading, setError])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ErrorState error={error} onRetry={reset} />
      </div>
    )
  }

  if (!walletAddress) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa] border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={reset}>
              <Logo className="w-6 h-6" />
              <span className="font-semibold text-sm text-black tracking-tight">Casper Agent</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden sm:block text-sm font-medium text-muted hover:text-black transition-colors">Features</a>
              <a href="#how-it-works" className="hidden sm:block text-sm font-medium text-muted hover:text-black transition-colors">How It Works</a>
              <button
                onClick={() => {
                  const element = document.getElementById('wallet-section')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-3 py-1.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section — left-aligned, dense, functional */}
        <section className="pt-24 pb-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div className="pt-8">
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-border text-xs font-mono text-muted mb-6">
                <span className="w-1.5 h-1.5 bg-green-500" />
                Casper Agentic Buildathon 2026 — $150K Prize Pool
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-black mb-4 leading-tight">
                Autonomous portfolio agent for Casper Network
              </h1>
              <p className="text-base text-muted mb-8 max-w-md leading-relaxed">
                AI-powered analysis with autonomous on-chain rebalancing. The agent reads your portfolio, thinks, and acts — all on Casper Testnet.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById('wallet-section')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Start Analyzing
                </button>
                <a
                  href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View contract →
                </a>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted">
                <span>Live on Testnet</span>
                <span className="text-border">|</span>
                <a href="https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Proof of write →</a>
              </div>
            </div>

            {/* Terminal activity log — the unique human-feeling element */}
            <div className="bg-black text-green-400 p-4 font-mono text-xs leading-relaxed border border-gray-800 mt-8 md:mt-0">
              <div className="flex items-center gap-2 mb-3 text-gray-500 border-b border-gray-800 pb-2">
                <span>agent.log</span>
                <span className="ml-auto">_</span>
              </div>
              <div className="space-y-1">
                <p><span className="text-gray-500">14:32:01</span> <span className="text-blue-400">INFO</span> Portfolio fetch initiated</p>
                <p><span className="text-gray-500">14:32:02</span> <span className="text-blue-400">INFO</span> Connected to CSPR.cloud API</p>
                <p><span className="text-gray-500">14:32:03</span> <span className="text-yellow-400">WARN</span> CSPR concentration 78% — above threshold</p>
                <p><span className="text-gray-500">14:32:04</span> <span className="text-blue-400">INFO</span> AI analysis: OpenAI GPT-4o</p>
                <p><span className="text-gray-500">14:32:05</span> <span className="text-green-400">OK</span> store_analysis recorded on-chain</p>
                <p><span className="text-gray-500">14:32:06</span> <span className="text-purple-400">ACT</span> Autonomous rebalance executed</p>
                <p><span className="text-gray-500">14:32:07</span> <span className="text-green-400">OK</span> Native transfer: 1 CSPR → user</p>
                <p className="text-gray-600 mt-2"><span className="terminal-cursor">_</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 md:px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-black mb-2">Capabilities</h2>
            <p className="text-sm text-muted mb-8">What the agent does on your behalf.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface border border-border p-4 hover:border-border-strong transition-colors">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">AI</div>
                <h3 className="text-sm font-semibold text-black mb-1">Portfolio Analysis</h3>
                <p className="text-xs text-muted leading-relaxed">OpenAI GPT-4o analyzes holdings and generates risk assessments in real-time.</p>
              </div>
              <div className="bg-surface border border-border p-4 hover:border-border-strong transition-colors">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">AG</div>
                <h3 className="text-sm font-semibold text-black mb-1">Agent Chat</h3>
                <p className="text-xs text-muted leading-relaxed">Conversational interface for portfolio queries and agent-directed actions.</p>
              </div>
              <div className="bg-surface border border-border p-4 hover:border-border-strong transition-colors">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">$0</div>
                <h3 className="text-sm font-semibold text-black mb-1">x402 Micropayments</h3>
                <p className="text-xs text-muted leading-relaxed">Agent pays per-analysis fees via Casper&apos;s x402 payment protocol.</p>
              </div>
              <div className="bg-surface border border-border p-4 hover:border-border-strong transition-colors">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">CH</div>
                <h3 className="text-sm font-semibold text-black mb-1">On-Chain Storage</h3>
                <p className="text-xs text-muted leading-relaxed">Analysis records persisted to Casper Testnet via Odra smart contract.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 px-4 md:px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-black mb-8">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface border border-border p-5 flex items-start gap-4 hover:border-border-strong transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-surface-alt border border-border flex items-center justify-center text-sm font-mono font-semibold">01</span>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">Connect Wallet</h3>
                  <p className="text-xs text-muted leading-relaxed">Enter your Casper public key. No private keys required.</p>
                </div>
              </div>
              <div className="bg-surface border border-border p-5 flex items-start gap-4 hover:border-border-strong transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-surface-alt border border-border flex items-center justify-center text-sm font-mono font-semibold">02</span>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">Fetch Balances</h3>
                  <p className="text-xs text-muted leading-relaxed">Real-time portfolio data from CSPR.cloud API.</p>
                </div>
              </div>
              <div className="bg-surface border border-border p-5 flex items-start gap-4 hover:border-border-strong transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-surface-alt border border-border flex items-center justify-center text-sm font-mono font-semibold">03</span>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">AI Analysis</h3>
                  <p className="text-xs text-muted leading-relaxed">GPT-4o generates risk profile and rebalancing suggestions.</p>
                </div>
              </div>
              <div className="bg-surface border border-border p-5 flex items-start gap-4 hover:border-border-strong transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-surface-alt border border-border flex items-center justify-center text-sm font-mono font-semibold">04</span>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">On-Chain Action</h3>
                  <p className="text-xs text-muted leading-relaxed">Agent records analysis and optionally executes rebalancing transfers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="wallet-section" className="py-16 px-4 md:px-6 border-t border-border">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold text-black mb-2">Connect Wallet</h2>
            <p className="text-sm text-muted mb-6">Enter your Casper address to begin analysis.</p>
            <WalletConnect />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-accent text-white py-8 px-4 md:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-300">Casper Agentic Buildathon 2026</p>
              <p className="text-xs text-gray-500 mt-1">Powered by OpenAI, x402, and Casper Network</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
              <span>Testnet</span>
              <span className="text-gray-700">|</span>
              <a href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Contract</a>
              <span className="text-gray-700">|</span>
              <a href="https://github.com/thesithunyein/casper-ai-portfolio-agent" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa] border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={reset}>
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-sm text-black tracking-tight">Casper Agent</span>
          </div>
          <button
            onClick={reset}
            className="px-3 py-1.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-12">
        {!portfolio ? (
          <div className="max-w-md mt-8">
            <div className="bg-surface border border-border p-5">
              <div className="mb-4">
                <p className="text-xs font-mono text-muted uppercase mb-1">Connected Wallet</p>
                <p className="font-mono text-xs text-black break-all bg-surface-alt border border-border p-2">{walletAddress}</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleAnalyze}
                  className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Analyze Portfolio
                </button>
                <button
                  onClick={reset}
                  className="w-full px-4 py-2.5 bg-surface-alt text-black text-sm font-medium border border-border hover:border-border-strong transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border">
              <div>
                <h1 className="text-xl font-semibold text-black">Analysis Results</h1>
                <p className="text-sm text-muted">Portfolio overview and AI insights</p>
              </div>
              <button
                onClick={reset}
                className="px-3 py-1.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <PortfolioDisplay portfolio={portfolio} />
                {analysis && <AIAnalysisComponent analysis={analysis} />}
              </div>
              <div className="lg:sticky lg:top-20">
                <AgentChat 
                  portfolio={portfolio} 
                  analysis={analysis} 
                  onAnalyze={handleAnalyze} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
