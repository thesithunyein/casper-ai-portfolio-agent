'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { fetchPortfolio } from '@/lib/injective'
import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioDisplay } from '@/components/PortfolioDisplay'
import { AIAnalysisComponent } from '@/components/AIAnalysis'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { Logo } from '@/components/Logo'
import { Brain, Shield, BarChart3 } from 'lucide-react'

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

  if (!walletAddress) {
    return (
      <main className="min-h-screen bg-white relative overflow-hidden">
        {/* Cool Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50" />
          
          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-secondary/15 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/10 to-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          
          {/* Animated floating particles */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-primary/25 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/30 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-primary/20 rounded-full animate-bounce" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
          <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '3s' }} />
          
          {/* Diagonal gradient lines */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary/[0.03] to-transparent transform rotate-12" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-secondary/[0.03] to-transparent transform -rotate-12" />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-lg text-black">Injective Agent</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-black transition">How It Works</a>
              <button
                onClick={() => {
                  const element = document.getElementById('wallet-section')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Your portfolio agent.
              <br />
              Always watching,
              <br />
              always gated.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-powered portfolio analysis and intelligent rebalancing recommendations powered by Claude AI for the Injective ecosystem
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('wallet-section')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition transform hover:scale-105"
            >
              Start Analyzing
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-black mb-12 text-center">Powerful Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary mb-4 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">AI Analysis</h3>
                <p className="text-gray-600">Claude AI analyzes your portfolio and provides actionable insights in seconds</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary mb-4 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Risk Assessment</h3>
                <p className="text-gray-600">Get detailed risk profiles and diversification analysis for your holdings</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary mb-4 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Rebalancing</h3>
                <p className="text-gray-600">Receive smart rebalancing suggestions tailored to your portfolio</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 py-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-16 text-center">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition duration-300" />
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary/50 transition duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl">1</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">Connect Wallet</h3>
                      <p className="text-gray-600 leading-relaxed">Enter your Injective wallet address securely. No private keys needed, just your public address.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition duration-300" />
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary/50 transition duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl">2</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">Fetch Portfolio</h3>
                      <p className="text-gray-600 leading-relaxed">We retrieve your real-time balance data directly from the Injective blockchain in seconds.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition duration-300" />
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary/50 transition duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl">3</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">AI Analysis</h3>
                      <p className="text-gray-600 leading-relaxed">Claude AI analyzes your holdings and generates comprehensive insights in real-time.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition duration-300" />
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary/50 transition duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl">4</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">Get Recommendations</h3>
                      <p className="text-gray-600 leading-relaxed">Receive actionable recommendations to optimize your portfolio and manage risk effectively.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="wallet-section" className="relative z-10 py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-black mb-8 text-center">Ready to Analyze?</h2>
            <WalletConnect />
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-black text-white py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
            <p>Built for Injective Solo AI Builder Sprint</p>
            <p className="mt-2">Powered by Claude AI and Injective Blockchain</p>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition" onClick={reset}>
            <Logo className="w-8 h-8" />
            <span className="font-bold text-lg text-black">Injective Agent</span>
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-24">
        {!portfolio ? (
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <p className="text-sm text-gray-600 uppercase tracking-wider mb-2">Connected Wallet</p>
                <p className="text-primary font-mono text-sm break-all">{walletAddress}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  className="w-full px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Analyze Portfolio
                </button>
                <button
                  onClick={reset}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all border border-gray-300"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-black">Analysis Results</h1>
                <p className="text-gray-600 text-lg mt-2">Portfolio overview and AI insights</p>
              </div>
              <button
                onClick={reset}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
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
