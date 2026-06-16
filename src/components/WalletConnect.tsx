'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { validateCasperAddress } from '@/lib/casper'

/* eslint-disable */

declare global {
  interface Window {
    CasperWalletProvider?: any
    casperWalletProvider?: any
    CasperSigner?: any
    casperlabsHelper?: any
  }
}

function findProvider(): any {
  const candidates = [
    'CasperWalletProvider',
    'casperWalletProvider',
    'CasperSigner',
    'casperlabsHelper',
  ] as const

  for (const name of candidates) {
    const val = (window as any)[name]
    if (val) return val
  }
  return undefined
}

function isProviderAvailable(): boolean {
  return !!findProvider()
}

function getAllMethods(obj: any): string[] {
  const methods = new Set<string>()
  let current = obj
  while (current && current !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(current)) {
      if (typeof current[key] === 'function' && key !== 'constructor') {
        methods.add(key)
      }
    }
    current = Object.getPrototypeOf(current)
  }
  return Array.from(methods)
}

function instantiateProvider(raw: any): any {
  // Some wallets expose a class that needs `new`
  if (typeof raw === 'function') {
    try {
      return new raw()
    } catch {
      // maybe it's already a singleton with static methods
      return raw
    }
  }
  return raw
}

async function tryMethod<T>(provider: any, names: string[]): Promise<T | undefined> {
  for (const name of names) {
    if (typeof provider[name] === 'function') {
      return await provider[name]()
    }
  }
  return undefined
}

export const WalletConnect = () => {
  const [input, setInput] = useState('')
  const [hasExtension, setHasExtension] = useState<boolean | null>(null)
  const [connecting, setConnecting] = useState(false)
  const { setWalletAddress, setError } = useAppStore()

  useEffect(() => {
    const check = () => {
      setHasExtension(isProviderAvailable())
    }
    check()
    const timer = setTimeout(check, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleExtensionConnect = async () => {
    const raw = findProvider()
    if (!raw) {
      setError('Casper Wallet extension not found. Please install it first.')
      return
    }

    const provider = instantiateProvider(raw)

    // Debug: log provider details to browser console
    // eslint-disable-next-line no-console
    console.log('[Casper Wallet] raw provider:', raw)
    // eslint-disable-next-line no-console
    console.log('[Casper Wallet] instantiated provider:', provider)
    // eslint-disable-next-line no-console
    console.log('[Casper Wallet] provider type:', typeof raw, '| is function:', typeof raw === 'function')
    // eslint-disable-next-line no-console
    console.log('[Casper Wallet] all methods:', getAllMethods(provider))

    setConnecting(true)
    setError(null)
    try {
      // Try to check if already connected
      let isConnected = false
      const connectedResult = await tryMethod<boolean>(provider, ['isConnected', 'isActive', 'hasConnected'])
      if (connectedResult !== undefined) {
        isConnected = connectedResult
      }

      // Request connection if not connected
      if (!isConnected) {
        const connectResult = await tryMethod<void>(provider, ['requestConnection', 'requestConnect', 'connect', 'requestConnectionToActiveKey'])
        if (connectResult === undefined) {
          const methods = getAllMethods(provider).join(', ')
          setError(`Could not find a connection method. Available methods: ${methods || 'none'}. Raw type: ${typeof raw}. Please connect manually.`)
          setConnecting(false)
          return
        }
      }

      // Get public key - try multiple method names
      const publicKey = await tryMethod<string>(provider, ['getActivePublicKey', 'getPublicKey', 'getActiveKey', 'publicKey', 'getSelectedKey'])

      if (publicKey && validateCasperAddress(publicKey)) {
        setWalletAddress(publicKey)
      } else if (publicKey) {
        setError(`Wallet returned an invalid public key: ${publicKey.slice(0, 20)}...`)
      } else {
        const methods = getAllMethods(provider).join(', ')
        setError(`Wallet connected but could not retrieve public key. Available methods: ${methods || 'none'}.`)
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
              {/* Stylized Casper C with dot */}
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M19 8.5C17.5 5.5 14.5 4 12 4C7.5 4 4 7.5 4 12C4 16.5 7.5 20 12 20C14.5 20 17.5 18.5 19 15.5" stroke="url(#casperGrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="5" r="2.2" fill="#06b6d4"/>
                <defs>
                  <linearGradient id="casperGrad" x1="4" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#a855f7"/>
                  </linearGradient>
                </defs>
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
