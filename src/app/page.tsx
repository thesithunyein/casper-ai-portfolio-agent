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
import { AgentActivityLog } from '@/components/AgentActivityLog'
import { RoadmapSection } from '@/components/RoadmapSection'
import { AppFooter } from '@/components/AppFooter'
import { RWADashboard } from '@/components/RWADashboard'
import type { AgentStep } from '@/lib/store'

export default function Home() {
  const {
    walletAddress,
    portfolio,
    analysis,
    loading,
    error,
    agentSteps,
    setPortfolio,
    setAnalysis,
    setLoading,
    setError,
    setActivityLog,
    appendActivityStep,
    updateActivityStep,
    setRwaPrices,
    addAgentStep,
    clearAgentSteps,
    reset,
  } = useAppStore()

  const handleAnalyze = useCallback(async () => {
    if (!walletAddress) return

    setLoading(true)
    setError(null)
    clearAgentSteps()

    const now = new Date()
    const ts = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

    setActivityLog([
      { id: 'fetch', label: 'Fetching portfolio from CSPR.cloud', status: 'active', timestamp: now },
      { id: 'rwa', label: 'Checking RWA oracle feed', status: 'pending' },
      { id: 'x402', label: 'Verifying x402 micropayment', status: 'pending' },
      { id: 'analyze', label: 'Running AI risk analysis', status: 'pending' },
      { id: 'onchain', label: 'Signing on-chain transaction', status: 'pending' },
      { id: 'submit', label: 'Submitting to Casper Testnet', status: 'pending' },
    ])

    const pushStep = (step: AgentStep) => addAgentStep(step)

    try {
      pushStep({ message: 'Connecting to CSPR.cloud API...', status: 'pending', timestamp: ts })
      const portfolioRes = await fetch(
        `/api/portfolio?address=${encodeURIComponent(walletAddress)}`
      )
      if (!portfolioRes.ok) {
        const err = await portfolioRes.json()
        throw new Error(err.error || 'Failed to fetch portfolio')
      }
      const portfolioData = await portfolioRes.json()
      portfolioData.lastUpdated = new Date(portfolioData.lastUpdated)
      setPortfolio(portfolioData)
      pushStep({
        message: `Portfolio fetched — ${portfolioData.assets.length} assets found`,
        status: 'success',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      updateActivityStep('fetch', {
        status: 'complete',
        detail: `${portfolioData.assets.length} assets, $${portfolioData.totalValue.toFixed(2)}`,
        timestamp: new Date(),
      })

      pushStep({
        message: 'Fetching live RWA data from Treasury.gov...',
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      const rwaRes = await fetch('/api/rwa-feed')
      let rwaData = null
      if (rwaRes.ok) {
        rwaData = await rwaRes.json()
        setRwaPrices({
          assets: [
            { symbol: 'TBILL', name: 'US T-bill', priceUsd: rwaData.tbill.yield, change24h: 0, source: 'Treasury.gov', simulated: false, category: 't_bill' },
            { symbol: 'PAXG', name: 'PAX Gold', priceUsd: rwaData.paxg.price, change24h: rwaData.paxg.change24h, source: 'CoinGecko', simulated: false, category: 'gold' },
            { symbol: 'ONDO', name: 'Ondo Finance', priceUsd: rwaData.ondo.price, change24h: rwaData.ondo.change24h, source: 'CoinGecko', simulated: false, category: 'equity' },
          ],
          timestamp: rwaData.timestamp,
          feedLabel: 'Live RWA Feed',
        })
      }
      if (rwaData) {
        pushStep({
          message: `T-bill yield: ${rwaData.tbill.yield}%`,
          status: 'rwa',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: `Fetching RWA token prices from CoinGecko...`,
          status: 'pending',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: `PAXG: $${rwaData.paxg.price.toFixed(2)} | ONDO: $${rwaData.ondo.price.toFixed(2)}`,
          status: 'rwa',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
      }
      updateActivityStep('rwa', {
        status: 'complete',
        detail: rwaData ? `T-bill ${rwaData.tbill.yield}%, PAXG $${rwaData.paxg.price.toFixed(0)}` : 'RWA feed unavailable',
        timestamp: new Date(),
      })

      pushStep({
        message: 'Verifying x402 micropayment...',
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      const payment = await createX402Payment(
        ANALYSIS_COST_CSPR,
        ANALYSIS_RECIPIENT,
        'Portfolio AI Analysis'
      )
      pushStep({
        message: `x402 payment verified — ${ANALYSIS_COST_CSPR} CSPR`,
        status: 'success',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      updateActivityStep('x402', {
        status: 'complete',
        detail: `${ANALYSIS_COST_CSPR} CSPR via x402`,
        timestamp: new Date(),
      })

      const modelName = process.env.OPENAI_API_KEY ? 'GPT-4o' : process.env.ANTHROPIC_API_KEY ? 'Claude 3.5 Sonnet' : 'Heuristic'
      pushStep({
        message: `Sending portfolio + RWA data to ${modelName}...`,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x402-payment': buildX402HeaderValue(payment),
        },
        body: JSON.stringify({
          portfolio: portfolioData,
          rwaPrices: rwaData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze portfolio')
      }

      const aiAnalysis = await response.json()
      setAnalysis(aiAnalysis)
      const riskLevel = aiAnalysis.riskAssessment?.toLowerCase().includes('high') ? 'High' :
        aiAnalysis.riskAssessment?.toLowerCase().includes('low') ? 'Low' : 'Medium'
      pushStep({
        message: `AI analysis complete — Risk: ${riskLevel}`,
        status: 'success',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      if (aiAnalysis.rwa_recommendation) {
        pushStep({
          message: `RWA recommendation: ${aiAnalysis.rwa_recommendation}`,
          status: 'rwa',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
      }
      updateActivityStep('analyze', {
        status: 'complete',
        detail: `Source: ${aiAnalysis.analysisSource || aiAnalysis.analysis_source || 'heuristic'}`,
        timestamp: new Date(),
      })

      if (aiAnalysis.onchain) {
        pushStep({
          message: 'Hashing analysis with SHA-256...',
          status: 'pending',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: `Hash: ${aiAnalysis.onchain.transactionHash.slice(0, 16)}...`,
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: 'Signing transaction with agent wallet...',
          status: 'pending',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: 'Transaction signed',
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: 'Submitting to Casper Testnet...',
          status: 'pending',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        pushStep({
          message: `TX: ${aiAnalysis.onchain.transactionHash} — View on Explorer →`,
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        updateActivityStep('onchain', {
          status: 'complete',
          detail: `Hash: ${aiAnalysis.onchain.transactionHash.slice(0, 16)}…`,
          timestamp: new Date(),
        })
        updateActivityStep('submit', {
          status: 'complete',
          detail: 'Confirmed on Casper Testnet',
          timestamp: new Date(),
        })
      } else {
        pushStep({
          message: 'On-chain recording skipped — agent key not configured',
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        updateActivityStep('onchain', {
          status: 'complete',
          detail: 'Agent key not configured',
          timestamp: new Date(),
        })
        updateActivityStep('submit', {
          status: 'complete',
          detail: 'On-chain write skipped',
          timestamp: new Date(),
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      pushStep({
        message: `Analysis failed: ${errorMessage}`,
        status: 'error',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      appendActivityStep({
        id: 'error',
        label: 'Analysis failed',
        status: 'error',
        detail: errorMessage,
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }, [walletAddress, setPortfolio, setAnalysis, setLoading, setError, setActivityLog, updateActivityStep, appendActivityStep, setRwaPrices, clearAgentSteps, addAgentStep])

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <ErrorState error={error} onRetry={reset} />
      </div>
    )
  }

  if (!walletAddress) {
    return (
      <main className="relative min-h-screen">

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 stripe-glass border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={reset}>
              <Logo className="relative w-7 h-7" />
              <span className="font-semibold text-[15px] text-ink-900 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-300">Casper Agent</span>
            </div>
            <div className="flex items-center gap-1">
              <a href="#features" className="hidden sm:block px-3 py-2 text-[13px] font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="hidden sm:block px-3 py-2 text-[13px] font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors duration-300">How It Works</a>
              <a href="#roadmap" className="hidden sm:block px-3 py-2 text-[13px] font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors duration-300">Roadmap</a>
              <a href="#faq" className="hidden sm:block px-3 py-2 text-[13px] font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors duration-300">FAQ</a>
              <a href="#docs" className="hidden sm:block px-3 py-2 text-[13px] font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors duration-300">Docs</a>
              <button
                onClick={() => {
                  const element = document.getElementById('wallet-section')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="ml-2 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300"
              >
                Connect
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 pt-36 pb-28 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.08] rounded-full text-xs font-medium text-primary mb-8 shadow-stripe-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Casper Agentic Buildathon 2026
              </div>
              <h1 className="text-[44px] md:text-[64px] leading-[1.05] font-bold text-ink-900 dark:text-white mb-6 tracking-tight">
                Autonomous portfolio management,{' '}
                <span className="gradient-text">powered by AI</span>
              </h1>
              <p className="text-lg text-ink-500 dark:text-ink-400 mb-4 max-w-lg leading-relaxed">
                AI-powered analysis with autonomous on-chain rebalancing. The agent reads your portfolio, checks RWA prices, and acts — all on Casper Testnet.
              </p>
              <p className="text-sm text-ink-400 dark:text-ink-500 mb-10 max-w-lg leading-relaxed">
                Supports CSPR, stablecoins, and RWA token analysis — including live US T-bill yields and tokenized gold (PAXG).
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <button
                  onClick={() => {
                    const element = document.getElementById('wallet-section')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Start Analyzing
                </button>
                <a
                  href="https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-black/[0.08] dark:border-white/[0.08] text-ink-700 dark:text-ink-200 text-sm font-semibold rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.03] hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all duration-300"
                >
                  View contract →
                </a>
              </div>
              <div className="flex items-center gap-6 text-xs font-medium text-ink-400 dark:text-ink-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live on Testnet
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <a href="https://testnet.cspr.live/transaction/cc648f7dab74736d2c0bb12b0178648f87b42c2b3cdd97c7de9a5b2a1307b779" target="_blank" rel="noopener noreferrer" className="hover:text-ink-900 dark:hover:text-white transition-colors">Proof of write →</a>
                </span>
              </div>
            </div>

            {/* Terminal activity log */}
            <div className="relative animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative bg-ink-950 border border-white/[0.06] rounded-xl p-5 font-mono text-xs leading-relaxed shadow-stripe-lg">
                <div className="flex items-center gap-2 mb-3 text-ink-400 border-b border-white/[0.06] pb-2">
                  <span className="text-primary">agent.log</span>
                  <span className="ml-auto text-ink-600">_</span>
                </div>
                <div className="space-y-1.5">
                  <p><span className="text-ink-600">14:32:01</span> <span className="text-primary">INFO</span> <span className="text-ink-300">Portfolio fetch initiated</span></p>
                  <p><span className="text-ink-600">14:32:02</span> <span className="text-primary">INFO</span> <span className="text-ink-300">Connected to CSPR.cloud API</span></p>
                  <p><span className="text-ink-600">14:32:02</span> <span className="text-primary">INFO</span> <span className="text-ink-300">RWA oracle: TBILL $99.87, XAU $2,345.60</span></p>
                  <p><span className="text-ink-600">14:32:03</span> <span className="text-amber-400">WARN</span> <span className="text-ink-300">CSPR concentration 78% — above threshold</span></p>
                  <p><span className="text-ink-600">14:32:04</span> <span className="text-primary">INFO</span> <span className="text-ink-300">AI analysis: OpenAI GPT-4o</span></p>
                  <p><span className="text-ink-600">14:32:05</span> <span className="text-emerald-400">OK</span> <span className="text-ink-300">store_analysis recorded on-chain</span></p>
                  <p><span className="text-ink-600">14:32:06</span> <span className="text-violet-400">ACT</span> <span className="text-ink-300">Autonomous rebalance executed</span></p>
                  <p><span className="text-ink-600">14:32:07</span> <span className="text-emerald-400">OK</span> <span className="text-ink-300">Native transfer: 1 CSPR → user</span></p>
                  <p className="text-ink-600 mt-2"><span className="terminal-cursor">_</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">Capabilities</h2>
              <p className="text-base text-ink-500 dark:text-ink-400 max-w-md mx-auto">What the agent does on your behalf.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
              {[
                { badge: 'AI', title: 'Portfolio Analysis', desc: 'OpenAI GPT-4o analyzes holdings and generates risk assessments in real-time.', color: 'bg-violet-50 text-violet-600 border-violet-100' },
                { badge: 'AG', title: 'Agent Chat', desc: 'Conversational interface for portfolio queries and agent-directed actions.', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                { badge: '$0', title: 'x402 Micropayments', desc: 'Agent pays per-analysis fees via Casper\'s x402 payment protocol.', color: 'bg-sky-50 text-sky-600 border-sky-100' },
                { badge: 'CH', title: 'On-Chain Storage', desc: 'Analysis records persisted to Casper Testnet via Odra smart contract.', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { badge: 'RWA', title: 'RWA Intelligence', desc: 'Live US T-bill yields, tokenized gold, and ONDO prices integrated into AI rebalancing.', color: 'bg-amber-50 text-amber-600 border-amber-100' },
              ].map((feat, i) => (
                <div key={i} className="group animate-fade-in">
                  <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-6 hover:shadow-stripe-md hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300 h-full">
                    <div className={`w-10 h-10 rounded-lg ${feat.color} border flex items-center justify-center text-xs font-mono font-bold mb-4`}>{feat.badge}</div>
                    <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-2 tracking-tight">{feat.title}</h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">How It Works</h2>
              <p className="text-base text-ink-500 dark:text-ink-400 max-w-md mx-auto">Four steps from connection to autonomous action.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 stagger-children">
              {[
                { num: '01', title: 'Connect Wallet', desc: 'Use Casper Wallet extension or enter your public key manually. No private keys ever required.' },
                { num: '02', title: 'Fetch Balances', desc: 'Real-time portfolio data pulled from CSPR.cloud API across all your token holdings.' },
                { num: '03', title: 'AI Analysis', desc: 'GPT-4o generates a complete risk profile and rebalancing suggestions tailored to your allocation.' },
                { num: '04', title: 'On-Chain Action', desc: 'Agent records analysis to the Odra contract and optionally executes autonomous rebalancing transfers.' },
              ].map((step, i) => (
                <div key={i} className="group animate-fade-in">
                  <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-6 flex items-start gap-4 hover:shadow-stripe-md hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300 h-full">
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-sm font-mono font-bold text-primary">{step.num}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-1 tracking-tight">{step.title}</h3>
                      <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">FAQ</h2>
              <p className="text-base text-ink-500 dark:text-ink-400">Common questions about the Casper AI Portfolio Agent.</p>
            </div>
            <div className="space-y-3">
              {[
                { q: 'Is this safe? Do you store my private keys?', a: 'Absolutely safe. We never ask for or store private keys. You only provide your public key (wallet address), which is publicly visible on the blockchain anyway.' },
                { q: 'What is x402 and why does the agent pay for analysis?', a: 'x402 is a Casper-native payment protocol for agent-to-agent micropayments. The agent holds its own CSPR and pays the analysis fee on your behalf, demonstrating true agentic autonomy.' },
                { q: 'What does "autonomous rebalancing" mean?', a: 'When the AI detects significant portfolio imbalance, the agent can autonomously execute a native CSPR transfer to rebalance — recorded transparently on-chain.' },
                { q: 'Which wallet do I need?', a: 'We recommend the Casper Wallet browser extension. You can also paste any valid Casper public key (starting with 01 or 02) to try the demo.' },
                { q: 'Is this on mainnet or testnet?', a: 'Currently running on Casper Testnet. Mainnet deployment is planned after the buildathon period.' },
              ].map((item, i) => (
                <details key={i} className="group bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl open:shadow-stripe-md open:border-black/[0.1] dark:open:border-white/[0.1] transition-all duration-300">
                  <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium text-ink-900 dark:text-white hover:text-primary transition-colors duration-300 list-none">
                    <span>{item.q}</span>
                    <span className="ml-4 text-primary transition-transform duration-300 group-open:rotate-180">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed animate-fade-in">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Live RWA Intelligence */}
        <RWADashboard />

        {/* Docs Section */}
        <section id="docs" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-4 tracking-tight">Documentation</h2>
              <p className="text-base text-ink-500 dark:text-ink-400 max-w-md mx-auto">Everything you need to understand and extend the agent.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Smart Contract', desc: 'Odra-based contract deployed on Casper Testnet. Stores analysis hashes and autonomous action records.', link: 'https://testnet.cspr.live/contract/0b4e53d2415953680a79a89069d91e673329c0a15a1897513a99f69124eb04b6', tag: 'Testnet' },
                { title: 'Roadmap', desc: 'Q3 2026 Mainnet, Q4 2026 RWA oracle + CEP-18, Q1 2027 Mobile PWA + DAO governance.', link: 'https://github.com/thesithunyein/casper-ai-portfolio-agent#roadmap--launch-plans', tag: 'Planned' },
                { title: 'GitHub Repository', desc: 'Full source code including frontend, AI agents, x402 integration, and Odra smart contracts.', link: 'https://github.com/thesithunyein/casper-ai-portfolio-agent', tag: 'Open Source' },
              ].map((doc, i) => (
                <a key={i} href={doc.link} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-6 hover:shadow-stripe-md hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded">{doc.tag}</span>
                      <svg className="w-4 h-4 text-ink-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-2">{doc.title}</h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed flex-1">{doc.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <RoadmapSection />

        {/* Connect Wallet Section */}
        <section id="wallet-section" className="relative z-10 py-24 px-6 lg:px-8 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[32px] md:text-[40px] font-bold text-ink-900 dark:text-white mb-3 tracking-tight">Connect Wallet</h2>
            <p className="text-base text-ink-500 dark:text-ink-400 mb-10 max-w-md mx-auto">Link your Casper wallet to get AI-powered portfolio analysis and autonomous rebalancing.</p>
            <WalletConnect />
          </div>
        </section>

        {/* Footer */}
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 stripe-glass border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={reset}>
            <Logo className="w-7 h-7" />
            <span className="font-semibold text-[15px] text-ink-900 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-300">Casper Agent</span>
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12">
        {!portfolio ? (
          <div className="max-w-md mt-8 mx-auto">
            <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-6 shadow-stripe-sm">
              <div className="mb-4">
                <p className="text-xs font-mono text-ink-400 dark:text-ink-500 uppercase mb-2 tracking-wider">Connected Wallet</p>
                <p className="font-mono text-xs text-ink-900 dark:text-white break-all bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] rounded-lg p-3">{walletAddress}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  className="w-full px-4 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300"
                >
                  Analyze Portfolio
                </button>
                <button
                  onClick={reset}
                  className="w-full px-4 py-3 bg-ink-50 dark:bg-ink-800 text-ink-900 dark:text-white text-sm font-medium border border-black/[0.06] dark:border-white/[0.06] rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 hover:border-black/[0.1] dark:hover:border-white/[0.1] transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <h1 className="text-xl font-semibold text-ink-900 dark:text-white tracking-tight">Analysis Results</h1>
                <p className="text-sm text-ink-500 dark:text-ink-400">Portfolio overview and AI insights</p>
              </div>
              <button
                onClick={reset}
                className="px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300"
              >
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <PortfolioDisplay portfolio={portfolio} />
                <AgentActivityLog steps={agentSteps} isRunning={loading} />
                {analysis && <AIAnalysisComponent analysis={analysis} />}
              </div>
              <div className="lg:sticky lg:top-20 space-y-6">
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
