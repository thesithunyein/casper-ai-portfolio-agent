'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { validateCasperAddress } from '@/lib/casper'

export const WalletConnect = () => {
  const [input, setInput] = useState('')
  const { setWalletAddress, setError } = useAppStore()

  const handleConnect = () => {
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
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border p-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-black mb-1">Wallet Address</h2>
          <p className="text-xs text-muted">Enter your Casper public key</p>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            placeholder="01abc..."
            className="w-full px-3 py-2 bg-surface-alt border border-border text-black placeholder-muted focus:outline-none focus:border-black transition-colors font-mono text-sm"
          />
          <button
            onClick={handleConnect}
            className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Analyze Portfolio
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500" />
          AI-Powered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-primary" />
          Casper Testnet
        </span>
      </div>
    </div>
  )
}
