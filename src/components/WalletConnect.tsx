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
      {/* Glow Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/30 via-neon-purple/20 to-neon-blue/30 rounded-xl blur opacity-60 group-hover:opacity-90 transition duration-500" />
        <div className="relative bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-white/20">
          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                {/* Casper Network diamond logo */}
                <path d="M12 2L22 12L12 22L2 12Z" fill="url(#wcGrad)" opacity="0.9"/>
                <path d="M12 6L18 12L12 18L6 12Z" fill="#0B0B1A"/>
                <path d="M12 8L16 12L12 16L8 12Z" fill="url(#wcGrad)"/>
                <defs>
                  <linearGradient id="wcGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#a855f7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">Connect Your Wallet</h2>
            <p className="text-sm text-gray-400">Enter your Casper public key to analyze your portfolio</p>
          </div>

          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Public Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setTouched(true) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                  placeholder="01abc... (66-68 characters)"
                  className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-white/15 focus:outline-none transition-all duration-300 font-mono text-sm rounded-lg ${
                    showError
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : isValid && input.trim()
                        ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20'
                        : 'border-white/10 focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20'
                  }`}
                />
                {isValid && input.trim() && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs">Valid</span>
                )}
              </div>
              {showError && (
                <p className="mt-2 text-xs text-red-400">
                  Must be 66-68 characters starting with 01 or 02.
                </p>
              )}
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleConnect}
              className="w-full px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Analyze Portfolio
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-gray-500 font-mono uppercase">or try demo</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Demo Button */}
            <button
              onClick={handleDemo}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
            >
              Try with Demo Account
            </button>
          </div>

          {/* Helper link */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <a
              href="https://testnet.cspr.live/tools/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-neon-cyan transition-colors"
            >
              Need testnet CSPR? Get tokens from the faucet →
            </a>
          </div>
        </div>
      </div>

      {/* Footer badges */}
      <div className="mt-5 flex items-center justify-center gap-6 text-[10px] font-mono text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          AI-Powered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
          Casper Testnet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
          x402 Ready
        </span>
      </div>
    </div>
  )
}
