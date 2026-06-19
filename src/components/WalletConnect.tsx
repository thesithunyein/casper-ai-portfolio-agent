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
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:border-border-strong card-lift shadow-sm">
        {/* Icon + Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
              <path d="M12 2L22 12L12 22L2 12Z" fill="#2563eb" opacity="0.9"/>
              <path d="M12 6L18 12L12 18L6 12Z" fill="#ffffff"/>
              <path d="M12 8L16 12L12 16L8 12Z" fill="#2563eb"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Connect Your Wallet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter your Casper public key to analyze your portfolio</p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Public Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setTouched(true) }}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="01abc... (66-68 characters)"
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all duration-300 font-mono text-sm rounded-lg ${
                  showError
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                    : isValid && input.trim()
                      ? 'border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
                }`}
              />
              {isValid && input.trim() && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xs">Valid</span>
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
            className="w-full px-4 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
          >
            Analyze Portfolio
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">or try demo</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Demo Button */}
          <button
            onClick={handleDemo}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-all duration-300 active:scale-[0.98]"
          >
            Try with Demo Account
          </button>
        </div>

        {/* Helper link */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
          <a
            href="https://testnet.cspr.live/tools/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-primary transition-colors"
          >
            Need testnet CSPR? Get tokens from the faucet →
          </a>
        </div>
      </div>

      {/* Footer badges */}
      <div className="mt-5 flex items-center justify-center gap-6 text-[10px] font-mono text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          AI-Powered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Casper Testnet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          x402 Ready
        </span>
      </div>
    </div>
  )
}
