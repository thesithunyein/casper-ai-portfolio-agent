'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { validateCasperAddress } from '@/lib/casper'
import { Wallet, Sparkles, Heart } from 'lucide-react'

export const WalletConnect = () => {
  const [input, setInput] = useState('')
  const { setWalletAddress, setError } = useAppStore()

  const handleConnect = () => {
    if (!input.trim()) {
      setError('Please enter a wallet address')
      return
    }

    if (!validateCasperAddress(input)) {
      setError('Invalid Casper public key. It must start with 01 (66 chars) or 02 (68 chars).')
      return
    }

    setWalletAddress(input)
    setError(null)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-black">Connect Wallet</h2>
              <Heart className="w-4 h-4 text-cute-dark animate-pulse" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Enter your Casper address</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 font-semibold">
              Wallet Address
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              placeholder="01abc..."
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>

          <button
            onClick={handleConnect}
            className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Analyze Portfolio
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
          AI-Powered Analysis
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cute-dark animate-pulse" style={{ animationDelay: '0.5s' }} />
          Casper Network
        </span>
      </div>
    </div>
  )
}
