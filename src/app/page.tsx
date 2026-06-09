'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { fetchPortfolio } from '@/lib/casper'
import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioDisplay } from '@/components/PortfolioDisplay'
import { AIAnalysisComponent } from '@/components/AIAnalysis'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { Logo } from '@/components/Logo'
import { AgentChat } from '@/components/AgentChat'
import { Brain, Shield, Sparkles, Heart, Star, Zap, Rainbow, Bot } from 'lucide-react'

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
              <span className="font-bold text-lg text-black">Casper Agent</span>
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
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 rounded-2xl mb-6 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-bold text-red-600">Casper Agentic Buildathon 2026</span>
              <span className="text-xs text-red-400 font-semibold">$150,000 Prize Pool</span>
            </div>
            <div className="relative inline-block mb-6 pb-4">
              <Sparkles className="absolute -top-4 -left-8 w-6 h-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
              <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <Star className="absolute top-1/2 -left-12 w-4 h-4 text-cyan-400 animate-pulse" />
              <Heart className="absolute bottom-4 -right-8 w-5 h-5 text-red-400 animate-bounce" style={{ animationDelay: '1s' }} />
              <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-3 leading-normal">
                Your portfolio agent
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-cute-dark to-secondary bg-clip-text text-transparent leading-normal pb-2">
                Always watching, always caring
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-powered portfolio analysis with cute bear-powered recommendations for the Casper ecosystem
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('wallet-section')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              Start Analyzing
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-12">
              <Rainbow className="w-8 h-8 text-cute-dark animate-bounce" />
              <h2 className="text-4xl font-bold text-black">Cute Features</h2>
              <Rainbow className="w-8 h-8 text-cute-dark animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-cute/50 transition-all hover:shadow-xl hover:shadow-cute/10 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-3 flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-1">AI Analysis</h3>
                <p className="text-gray-600 text-sm">Claude AI analyzes your portfolio and provides actionable insights in seconds</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-cute/50 transition-all hover:shadow-xl hover:shadow-cute/10 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary mb-3 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-1">Agent Chat</h3>
                <p className="text-gray-600 text-sm">Conversational AI agent that answers questions and takes actions for your portfolio</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-cute/50 transition-all hover:shadow-xl hover:shadow-cute/10 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cute-dark to-secondary mb-3 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-1">x402 Payments</h3>
                <p className="text-gray-600 text-sm">Agent pays 0.01 CSPR per analysis via Casper&apos;s micropayment protocol</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-cute/50 transition-all hover:shadow-xl hover:shadow-cute/10 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-orange-400 mb-3 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-1">On-Chain Storage</h3>
                <p className="text-gray-600 text-sm">Analysis results stored on Casper Testnet via Odra smart contract</p>
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
                      <p className="text-gray-600 leading-relaxed">Enter your Casper wallet address securely. No private keys needed, just your public address.</p>
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
                      <p className="text-gray-600 leading-relaxed">We retrieve your real-time balance data directly from the Casper blockchain via CSPR.cloud API in seconds.</p>
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
            <div className="flex items-center justify-center gap-2 mb-8">
              <Heart className="w-6 h-6 text-cute-dark animate-pulse" />
              <h2 className="text-4xl font-bold text-black text-center">Ready to Analyze?</h2>
              <Heart className="w-6 h-6 text-cute-dark animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <WalletConnect />
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4 md:px-8 rounded-t-3xl">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-cute-dark animate-pulse" />
              <p className="text-gray-300 text-sm font-semibold">Casper Agentic Buildathon 2026 Submission</p>
              <Heart className="w-5 h-5 text-cute-dark animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-gray-500 text-xs">Powered by Claude AI, x402, and Casper Network</p>
            <div className="mt-4 flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-cute-dark animate-pulse" style={{ animationDelay: '0.4s' }} />
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Cute Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cute/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-20 right-20 w-4 h-4 bg-cute rounded-full animate-float" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-secondary/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition" onClick={reset}>
            <Logo className="w-8 h-8" />
            <span className="font-bold text-lg text-black">Casper Agent</span>
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-bold hover:shadow-lg transition transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-24">
        {!portfolio ? (
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-semibold">Connected Wallet</p>
                <p className="text-primary font-mono text-sm break-all bg-gray-50 rounded-xl p-3">{walletAddress}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Analyze Portfolio
                </button>
                <button
                  onClick={reset}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all border-2 border-gray-200"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-cute-dark animate-bounce" />
                  <h1 className="text-4xl font-bold text-black">Analysis Results</h1>
                  <Sparkles className="w-6 h-6 text-cute-dark animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <p className="text-gray-600 text-lg">Portfolio overview and AI insights</p>
              </div>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl hover:shadow-lg transition-all font-bold transform hover:scale-105 flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <PortfolioDisplay portfolio={portfolio} />
                {analysis && <AIAnalysisComponent analysis={analysis} />}
              </div>
              <div className="lg:sticky lg:top-24">
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
