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
      <div className="relative min-h-screen">
        <div className="galaxy-bg" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <LoadingState />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen">
        <div className="galaxy-bg" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <ErrorState error={error} onRetry={reset} />
        </div>
      </div>
    )
  }

  if (!walletAddress) {
    return (
      <main className="relative min-h-screen">
        {/* Galaxy Background */}
        <div className="galaxy-bg">
          <div className="twinkle-layer" />
          <div className="shooting-star" />
          <div className="shooting-star" />
          <div className="shooting-star" />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-galaxy-900/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={reset}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/30 to-neon-purple/30 rounded-lg blur opacity-0 group-hover:opacity-60 transition duration-500" />
                <Logo className="relative w-7 h-7" />
              </div>
              <span className="font-semibold text-sm text-white tracking-tight group-hover:text-neon-cyan transition-colors duration-300">Casper Agent</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden sm:block text-sm font-medium text-muted hover:text-white transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="hidden sm:block text-sm font-medium text-muted hover:text-white transition-colors duration-300">How It Works</a>
              <a href="#faq" className="hidden sm:block text-sm font-medium text-muted hover:text-white transition-colors duration-300">FAQ</a>
              <a href="#docs" className="hidden sm:block text-sm font-medium text-muted hover:text-white transition-colors duration-300">Docs</a>
              <button
                onClick={() => {
                  const element = document.getElementById('wallet-section')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-neon-cyan/20"
              >
                Connect
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 pt-28 pb-20 px-4 md:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-neon-cyan mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Casper Agentic Buildathon 2026
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Autonomous portfolio agent for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Casper Network</span>
              </h1>
              <p className="text-base text-gray-300 mb-8 max-w-lg leading-relaxed">
                AI-powered analysis with autonomous on-chain rebalancing. The agent reads your portfolio, thinks, and acts — all on Casper Testnet.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById('wallet-section')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Start Analyzing
                </button>
                <a
                  href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neon-cyan hover:text-white transition-colors duration-300"
                >
                  View contract →
                </a>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Live on Testnet
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                  <a href="https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">Proof of write →</a>
                </span>
              </div>
            </div>

            {/* Terminal activity log */}
            <div className="relative group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-500" />
              <div className="relative bg-galaxy-800/90 backdrop-blur-md border border-white/10 rounded-xl p-5 font-mono text-xs leading-relaxed">
                <div className="flex items-center gap-2 mb-3 text-gray-500 border-b border-white/10 pb-2">
                  <span className="text-neon-cyan">agent.log</span>
                  <span className="ml-auto text-gray-600">_</span>
                </div>
                <div className="space-y-1.5">
                  <p><span className="text-gray-600">14:32:01</span> <span className="text-neon-blue">INFO</span> <span className="text-gray-300">Portfolio fetch initiated</span></p>
                  <p><span className="text-gray-600">14:32:02</span> <span className="text-neon-blue">INFO</span> <span className="text-gray-300">Connected to CSPR.cloud API</span></p>
                  <p><span className="text-gray-600">14:32:03</span> <span className="text-yellow-400">WARN</span> <span className="text-gray-300">CSPR concentration 78% — above threshold</span></p>
                  <p><span className="text-gray-600">14:32:04</span> <span className="text-neon-blue">INFO</span> <span className="text-gray-300">AI analysis: OpenAI GPT-4o</span></p>
                  <p><span className="text-gray-600">14:32:05</span> <span className="text-green-400">OK</span> <span className="text-gray-300">store_analysis recorded on-chain</span></p>
                  <p><span className="text-gray-600">14:32:06</span> <span className="text-neon-purple">ACT</span> <span className="text-gray-300">Autonomous rebalance executed</span></p>
                  <p><span className="text-gray-600">14:32:07</span> <span className="text-green-400">OK</span> <span className="text-gray-300">Native transfer: 1 CSPR → user</span></p>
                  <p className="text-gray-600 mt-2"><span className="terminal-cursor">_</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 px-4 md:px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Capabilities</h2>
              <p className="text-sm text-muted max-w-md mx-auto">What the agent does on your behalf.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { badge: 'AI', title: 'Portfolio Analysis', desc: 'OpenAI GPT-4o analyzes holdings and generates risk assessments in real-time.', color: 'from-neon-cyan/20 to-neon-blue/20' },
                { badge: 'AG', title: 'Agent Chat', desc: 'Conversational interface for portfolio queries and agent-directed actions.', color: 'from-neon-purple/20 to-neon-pink/20' },
                { badge: '$0', title: 'x402 Micropayments', desc: 'Agent pays per-analysis fees via Casper\'s x402 payment protocol.', color: 'from-neon-blue/20 to-neon-cyan/20' },
                { badge: 'CH', title: 'On-Chain Storage', desc: 'Analysis records persisted to Casper Testnet via Odra smart contract.', color: 'from-neon-pink/20 to-neon-purple/20' },
              ].map((feat, i) => (
                <div key={i} className="group relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feat.color} rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-500`} />
                  <div className="relative bg-galaxy-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center text-xs font-mono font-bold text-neon-cyan mb-4">{feat.badge}</div>
                    <h3 className="text-sm font-semibold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 py-20 px-4 md:px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
              <p className="text-sm text-muted max-w-md mx-auto">Four steps from connection to autonomous action.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { num: '01', title: 'Connect Wallet', desc: 'Use Casper Wallet extension or enter your public key manually. No private keys ever required.' },
                { num: '02', title: 'Fetch Balances', desc: 'Real-time portfolio data pulled from CSPR.cloud API across all your token holdings.' },
                { num: '03', title: 'AI Analysis', desc: 'GPT-4o generates a complete risk profile and rebalancing suggestions tailored to your allocation.' },
                { num: '04', title: 'On-Chain Action', desc: 'Agent records analysis to the Odra contract and optionally executes autonomous rebalancing transfers.' },
              ].map((step, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative bg-galaxy-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4 hover:border-white/20 transition-all duration-300">
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center text-sm font-mono font-bold text-neon-cyan">{step.num}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative z-10 py-20 px-4 md:px-6 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">FAQ</h2>
              <p className="text-sm text-muted">Common questions about the Casper AI Portfolio Agent.</p>
            </div>
            <div className="space-y-4">
              {[
                { q: 'Is this safe? Do you store my private keys?', a: 'Absolutely safe. We never ask for or store private keys. You only provide your public key (wallet address), which is publicly visible on the blockchain anyway.' },
                { q: 'What is x402 and why does the agent pay for analysis?', a: 'x402 is a Casper-native payment protocol for agent-to-agent micropayments. The agent holds its own CSPR and pays the analysis fee on your behalf, demonstrating true agentic autonomy.' },
                { q: 'What does "autonomous rebalancing" mean?', a: 'When the AI detects significant portfolio imbalance, the agent can autonomously execute a native CSPR transfer to rebalance — recorded transparently on-chain.' },
                { q: 'Which wallet do I need?', a: 'We recommend the Casper Wallet browser extension. You can also paste any valid Casper public key (starting with 01 or 02) to try the demo.' },
                { q: 'Is this on mainnet or testnet?', a: 'Currently running on Casper Testnet. Mainnet deployment is planned after the buildathon period.' },
              ].map((item, i) => (
                <details key={i} className="group bg-galaxy-800/60 backdrop-blur-sm border border-white/10 rounded-xl open:border-white/20 transition-all duration-300">
                  <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium text-white hover:text-neon-cyan transition-colors duration-300 list-none">
                    <span>{item.q}</span>
                    <span className="ml-4 text-neon-cyan transition-transform duration-300 group-open:rotate-180">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed animate-fade-in">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Docs Section */}
        <section id="docs" className="relative z-10 py-20 px-4 md:px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Documentation</h2>
              <p className="text-sm text-muted max-w-md mx-auto">Everything you need to understand and extend the agent.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Smart Contract', desc: 'Odra-based contract deployed on Casper Testnet. Stores analysis hashes and autonomous action records.', link: 'https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6', tag: 'Testnet' },
                { title: 'API Reference', desc: 'REST endpoints for portfolio fetching, AI analysis with x402 payment headers, and agent status.', link: '#', tag: 'Coming Soon' },
                { title: 'GitHub Repository', desc: 'Full source code including frontend, AI agents, x402 integration, and Odra smart contracts.', link: 'https://github.com/thesithunyein/casper-ai-portfolio-agent', tag: 'Open Source' },
              ].map((doc, i) => (
                <a key={i} href={doc.link} target="_blank" rel="noopener noreferrer" className="group relative block">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative bg-galaxy-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-1 rounded">{doc.tag}</span>
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-neon-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">{doc.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed flex-1">{doc.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Connect Wallet Section */}
        <section id="wallet-section" className="relative z-10 py-20 px-4 md:px-6 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Connect Wallet</h2>
            <p className="text-sm text-muted mb-8 max-w-md mx-auto">Link your Casper wallet to get AI-powered portfolio analysis and autonomous rebalancing.</p>
            <WalletConnect />
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-galaxy-900/80 backdrop-blur-md border-t border-white/10 py-8 px-4 md:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-300">Casper Agentic Buildathon 2026</p>
              <p className="text-xs text-gray-500 mt-1">Powered by OpenAI, x402, and Casper Network</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
              <span>Testnet</span>
              <span className="text-gray-700">|</span>
              <a href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contract</a>
              <span className="text-gray-700">|</span>
              <a href="https://github.com/thesithunyein/casper-ai-portfolio-agent" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Galaxy Background */}
      <div className="galaxy-bg" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-galaxy-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity duration-300" onClick={reset}>
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-sm text-white tracking-tight">Casper Agent</span>
          </div>
          <button
            onClick={reset}
            className="px-4 py-1.5 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12">
        {!portfolio ? (
          <div className="max-w-md mt-8 mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-500" />
              <div className="relative bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="mb-4">
                  <p className="text-xs font-mono text-muted uppercase mb-2">Connected Wallet</p>
                  <p className="font-mono text-xs text-white break-all bg-white/5 border border-white/10 rounded-lg p-3">{walletAddress}</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleAnalyze}
                    className="w-full px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300"
                  >
                    Analyze Portfolio
                  </button>
                  <button
                    onClick={reset}
                    className="w-full px-4 py-3 bg-white/5 text-white text-sm font-medium border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
              <div>
                <h1 className="text-xl font-semibold text-white">Analysis Results</h1>
                <p className="text-sm text-muted">Portfolio overview and AI insights</p>
              </div>
              <button
                onClick={reset}
                className="px-4 py-1.5 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity duration-300"
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
