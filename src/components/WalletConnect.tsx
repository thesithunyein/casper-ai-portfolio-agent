'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { validateCasperAddress } from '@/lib/casper'

type WalletProvider = {
  isConnected: () => Promise<boolean>
  requestConnection: () => Promise<void>
  getActivePublicKey: () => Promise<string>
  disconnectFromSite: () => Promise<void>
}

declare global {
  interface Window {
    CasperWalletProvider?: WalletProvider
  }
}

export const WalletConnect = () => {
  const [input, setInput] = useState('')
  const [hasExtension, setHasExtension] = useState<boolean | null>(null)
  const [connecting, setConnecting] = useState(false)
  const { setWalletAddress, setError } = useAppStore()

  useEffect(() => {
    // Detect Casper Wallet extension
    const check = () => {
      setHasExtension(!!window.CasperWalletProvider)
    }
    check()
    // Some extensions inject after page load
    const timer = setTimeout(check, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleExtensionConnect = async () => {
    const provider = window.CasperWalletProvider
    if (!provider) {
      setError('Casper Wallet extension not found. Please install it first.')
      return
    }
    setConnecting(true)
    setError(null)
    try {
      const connected = await provider.isConnected()
      if (!connected) {
        await provider.requestConnection()
      }
      const publicKey = await provider.getActivePublicKey()
      if (publicKey && validateCasperAddress(publicKey)) {
        setWalletAddress(publicKey)
      } else {
        setError('Could not get a valid public key from the wallet.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Wallet connection failed'
      setError(msg)
    } finally {
      setConnecting(false)
    }
  }

  const handleManualConnect = () => {
    if (!input.trim()) {
      setError('Please enter a wallet address')
      return
    }
    if (!validateCasperAddress(input)) {
      setError('Invalid Casper public key. Must start with 01 (66 chars) or 02 (68 chars).')
      return
    }
    setWalletAddress(input)
    setError(null)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/30 via-neon-purple/20 to-neon-blue/30 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-500" />
        <div className="relative bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12m0 0l5.25-5.25M3 12l5.25 5.25M21 12l-5.25-5.25M21 12l-5.25 5.25" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Connect Wallet</h2>
            <p className="text-sm text-muted">Choose your preferred connection method</p>
          </div>

          {/* Extension Button */}
          <button
            onClick={handleExtensionConnect}
            disabled={connecting}
            className="w-full mb-3 px-4 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/40 text-white text-sm font-medium rounded-lg hover:from-neon-cyan/30 hover:to-neon-blue/30 hover:border-neon-cyan/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${hasExtension ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${hasExtension ? 'bg-green-500' : 'bg-yellow-500'}`} />
            </span>
            {connecting ? 'Connecting...' : hasExtension ? 'Casper Wallet Extension' : 'Install Casper Wallet'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted font-mono">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Manual Input */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1.5">Public Key</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualConnect()}
                placeholder="01abc... (66-68 chars)"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300 font-mono text-sm rounded-lg"
              />
            </div>
            <button
              onClick={handleManualConnect}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Connect Manually
            </button>
          </div>

          {/* Mobile App Link */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <a
              href="https://casperwallet.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-neon-cyan transition-colors"
            >
              Don&apos;t have a wallet? Get Casper Wallet →
            </a>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono text-muted">
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
