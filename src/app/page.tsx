'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { fetchPortfolio } from '@/lib/injective'
import { analyzePortfolio } from '@/lib/ai'
import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioDisplay } from '@/components/PortfolioDisplay'
import { AIAnalysisComponent } from '@/components/AIAnalysis'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { Zap } from 'lucide-react'

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

      const aiAnalysis = await analyzePortfolio(portfolioData)
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
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Injective AI Portfolio Agent
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            AI-powered portfolio analysis and rebalancing for Injective
          </p>
        </header>

        {!walletAddress ? (
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        ) : !portfolio ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-center mb-4">
              <p className="text-gray-300 mb-4">
                Connected: <span className="text-primary font-mono">{walletAddress}</span>
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Analyze Portfolio
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 bg-accent text-gray-300 rounded-lg hover:bg-accent/80 transition-colors"
            >
              Change Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
              <button
                onClick={reset}
                className="px-4 py-2 bg-accent text-gray-300 rounded-lg hover:bg-accent/80 transition-colors"
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
