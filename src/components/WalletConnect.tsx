'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { validateInjectiveAddress } from '@/lib/injective'
import { Wallet } from 'lucide-react'

export const WalletConnect = () => {
  const [input, setInput] = useState('')
  const { setWalletAddress, setError } = useAppStore()

  const handleConnect = () => {
    if (!input.trim()) {
      setError('Please enter a wallet address')
      return
    }

    if (!validateInjectiveAddress(input)) {
      setError('Invalid Injective address. Must start with "inj" and be 42 characters.')
      return
    }

    setWalletAddress(input)
    setError(null)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">Connect Wallet</h2>
            <p className="text-gray-600 text-sm">Enter your Injective address</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-600 uppercase tracking-wider mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              placeholder="inj1..."
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>

          <button
            onClick={handleConnect}
            className="w-full px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Analyze Portfolio
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          AI-Powered Analysis
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
          Injective Network
        </span>
      </div>
    </div>
  )
}
