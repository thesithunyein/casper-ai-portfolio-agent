'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import {
  ANALYSIS_COST_CSPR,
  ANALYSIS_RECIPIENT,
  buildX402HeaderValue,
  createX402Payment,
} from '@/lib/x402'
import { HomeLanding } from '@/components/HomeLanding'
import { AgentRunningScreen } from '@/components/AgentRunningScreen'
import { ResultsDashboard } from '@/components/ResultsDashboard'
import { AppShell } from '@/components/AppShell'
import type { AgentStep } from '@/lib/store'

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
        message: 'Building x402 payment intent...',
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      const payment = await createX402Payment(
        ANALYSIS_COST_CSPR,
        ANALYSIS_RECIPIENT,
        'Portfolio AI Analysis'
      )
      pushStep({
        message: `x402 intent created — ${ANALYSIS_COST_CSPR} CSPR (settling on analysis)`,
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

      if (aiAnalysis.x402Payment?.explorerUrl) {
        pushStep({
          message: `x402 SETTLED on-chain — ${aiAnalysis.x402Payment.amountCspr} CSPR (${aiAnalysis.x402Payment.mode})`,
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          href: aiAnalysis.x402Payment.explorerUrl,
        })
        updateActivityStep('x402', {
          status: 'complete',
          detail: `Settled ${aiAnalysis.x402Payment.amountCspr} CSPR`,
          timestamp: new Date(),
        })
      } else if (aiAnalysis.x402Status === 'verified') {
        pushStep({
          message: 'x402 header verified (on-chain settle skipped this run)',
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
      }

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
          href: aiAnalysis.onchain.explorerUrl,
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
        const chainErr =
          typeof aiAnalysis.onchainError === 'string' && aiAnalysis.onchainError
            ? aiAnalysis.onchainError
            : 'On-chain write not returned this run'
        pushStep({
          message: `On-chain recording failed — ${chainErr}`,
          status: 'error',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        updateActivityStep('onchain', {
          status: 'error',
          detail: chainErr,
          timestamp: new Date(),
        })
        updateActivityStep('submit', {
          status: 'error',
          detail: 'On-chain write failed',
          timestamp: new Date(),
        })
      }

      // Multi-Agent Coordination steps
      if (aiAnalysis.multiAgent) {
        const ma = aiAnalysis.multiAgent
        pushStep({
          message: `Multi-agent swarm: ${ma.successfulActions}/${ma.totalActions} agents completed`,
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })
        ma.agents.forEach((agent: { role: string; name: string; action: string; status: string }) => {
          pushStep({
            message: `${agent.name}: ${agent.action}`,
            status: agent.status === 'success' || agent.status === 'completed' ? 'success' : 'pending',
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          })
        })
      }

      // Yield Routing steps
      if (aiAnalysis.yieldRouting) {
        const yr = aiAnalysis.yieldRouting
        if (yr.opportunities > 0) {
          pushStep({
            message: `Yield routing: ${yr.opportunities} opportunities found, best APY ${yr.bestApy.toFixed(2)}%`,
            status: 'rwa',
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          })
          if (yr.bestProtocol) {
            pushStep({
              message: `Top protocol: ${yr.bestProtocol} via ${yr.mcpServersUsed} MCP server(s)`,
              status: 'success',
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            })
          }
        } else {
          pushStep({
            message: 'Yield routing: no opportunities found (MCP not configured)',
            status: 'pending',
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          })
        }
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

  // Auto-start analysis once per connected address (Connect Wallet / Try Demo).
  const autoStartedFor = useRef<string | null>(null)
  useEffect(() => {
    if (!walletAddress) {
      autoStartedFor.current = null
      return
    }
    if (autoStartedFor.current === walletAddress) return
    autoStartedFor.current = walletAddress
    setLoading(true) // show full-screen runner immediately (before async work)
    void handleAnalyze()
  }, [walletAddress, handleAnalyze, setLoading])

  if (walletAddress && loading) {
    return <AgentRunningScreen onCancel={reset} />
  }

  if (!walletAddress) {
    return <HomeLanding onLogoClick={reset} />
  }

  if (portfolio && analysis) {
    return (
      <ResultsDashboard
        portfolio={portfolio}
        analysis={analysis}
        walletAddress={walletAddress}
        error={error}
        onReset={reset}
        onRetry={() => {
          setError(null)
          void handleAnalyze()
        }}
      />
    )
  }

  return (
    <AppShell
      onLogoClick={reset}
      centered
      rightSlot={
        <button
          onClick={reset}
          className="text-[13px] font-medium text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
        >
          Disconnect
        </button>
      }
    >
      <div className="text-center animate-fade-in max-w-sm mx-auto">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
          {error || 'Ready to analyze this wallet.'}
        </p>
        <button
          onClick={() => void handleAnalyze()}
          className="w-full px-4 py-3.5 bg-primary text-primary-ink text-sm font-semibold rounded-2xl hover:bg-primary-hover shadow-[0_8px_24px_rgba(223,255,0,0.3)]"
        >
          Analyze Portfolio
        </button>
      </div>
    </AppShell>
  )
}
