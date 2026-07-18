'use client'

import { useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { validateCasperAddress } from '@/lib/casper'

const DEMO_ADDRESS = '018ac72bcc176b6bedc8928772d591b57888c67c0c5d1f31712a3593c2ee582f90'

export const WalletConnect = () => {
  const [input, setInput] = useState('')
  const [touched, setTouched] = useState(false)
  const { setWalletAddress, setError } = useAppStore()

  const isValid = validateCasperAddress(input.trim())
  const showError = touched && input.trim().length > 0 && !isValid

  const handleConnect = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Please enter your Casper public key')
      setTouched(true)
      return
    }
    if (!validateCasperAddress(trimmed)) {
      setError('Invalid public key. Must be 66-68 characters starting with 01 or 02.')
      setTouched(true)
      return
    }
    setWalletAddress(trimmed)
    setError(null)
  }, [input, setWalletAddress, setError])

  const handleDemo = useCallback(() => {
    setInput(DEMO_ADDRESS)
    setWalletAddress(DEMO_ADDRESS)
    setError(null)
  }, [setWalletAddress, setError])

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <div className="relative bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-black/[0.1] dark:hover:border-white/[0.1] card-lift shadow-stripe-sm">
        {/* Icon + Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
              <path d="M3 7L12 2L21 7L12 12L3 7Z" fill="#635bff" opacity="0.9"/>
              <path d="M3 7V17L12 22V12L3 7Z" fill="#635bff" opacity="0.6"/>
              <path d="M21 7V17L12 22V12L21 7Z" fill="#635bff" opacity="0.4"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-1 tracking-tight">Connect Your Wallet</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Enter your Casper public key to analyze your portfolio</p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">
              Public Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setTouched(true) }}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="01abc... (66-68 characters)"
                className={`w-full px-4 py-3 bg-ink-50 dark:bg-ink-800/50 border text-ink-900 dark:text-white placeholder-ink-400 dark:placeholder-ink-600 focus:outline-none transition-all duration-300 font-mono text-sm rounded-lg ${
                  showError
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                    : isValid && input.trim()
                      ? 'border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20'
                      : 'border-black/[0.06] dark:border-white/[0.06] focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
                }`}
              />
              {isValid && input.trim() && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-medium">Valid</span>
              )}
            </div>
            {showError && (
              <p className="mt-2 text-xs text-red-500">
                Must be 66-68 characters starting with 01 or 02.
              </p>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleConnect}
            className="w-full px-4 py-3.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
          >
            Connect & Analyze
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
            <span className="text-[10px] text-ink-400 dark:text-ink-500 font-mono uppercase tracking-wider">or try demo</span>
            <div className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
          </div>

          {/* Demo Button */}
          <button
            onClick={handleDemo}
            className="w-full px-4 py-2.5 bg-ink-50 dark:bg-ink-800/50 border border-black/[0.06] dark:border-white/[0.06] text-ink-600 dark:text-ink-300 text-sm font-medium rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 hover:border-black/[0.1] dark:hover:border-white/[0.1] hover:text-ink-900 dark:hover:text-white transition-all duration-300 active:scale-[0.98]"
          >
            Try Demo — Auto-Analyze
          </button>
        </div>

        {/* Helper link */}
        <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
          <a
            href="https://testnet.cspr.live/tools/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-400 dark:text-ink-500 hover:text-primary transition-colors duration-300"
          >
            Need testnet CSPR? Get tokens from the faucet →
          </a>
        </div>
      </div>

      {/* Footer badges */}
      <div className="mt-5 flex items-center justify-center gap-6 text-[10px] font-mono text-ink-400 dark:text-ink-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI-Powered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Casper Testnet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          x402 Settle
        </span>
      </div>
    </div>
  )
}
