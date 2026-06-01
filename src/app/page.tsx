'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { fetchPortfolio } from '@/lib/injective'
import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioDisplay } from '@/components/PortfolioDisplay'
import { AIAnalysisComponent } from '@/components/AIAnalysis'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'

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
      const portfolioData = await fetchPortfolio(walletAddress)
      setPortfolio(portfolioData)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d1f1a] to-[#0a0a0a] pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">AI-Powered Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Injective</span>
            <br />
            <span className="text-white">Portfolio Agent</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Intelligent portfolio analysis and rebalancing recommendations powered by Claude AI for the Injective ecosystem
          </p>
        </header>

        {!walletAddress ? (
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        ) : !portfolio ? (
          <div className="max-w-md mx-auto">
            <div className="glass-strong rounded-2xl p-8 text-center">
              <div className="mb-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Connected Wallet</p>
                <p className="text-primary font-mono text-sm break-all">{walletAddress}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  className="w-full px-6 py-4 bg-primary text-black font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Analyze Portfolio
                </button>
                <button
                  onClick={reset}
                  className="w-full px-6 py-3 bg-white/5 text-gray-400 font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                <p className="text-gray-500 text-sm mt-1">Portfolio overview and AI insights</p>
              </div>
              <button
                onClick={reset}
                className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all border border-white/10 text-sm font-medium"
              >
                New Analysis
              </button>
            </div>

            <PortfolioDisplay portfolio={portfolio} />

            {analysis && <AIAnalysisComponent analysis={analysis} />}
          </div>
        )}
      </div>
    </main>
  )
}
