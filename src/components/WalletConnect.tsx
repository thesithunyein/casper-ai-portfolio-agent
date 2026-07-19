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
    <div className="w-full text-left space-y-3">
      <label className="block text-[10px] font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wider text-center">
        Public key
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setTouched(true)
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
        placeholder="01… or 02…"
        className={`w-full px-4 py-3.5 bg-white/90 dark:bg-ink-900/90 border text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none font-mono text-sm rounded-2xl shadow-stripe-sm transition-colors ${
          showError
            ? 'border-red-300 focus:border-red-500'
            : isValid && input.trim()
              ? 'border-emerald-300 focus:border-emerald-500'
              : 'border-black/[0.06] dark:border-white/[0.08] focus:border-primary/40'
        }`}
      />
      {showError && (
        <p className="text-xs text-red-500 text-center">
          Must be 66–68 characters starting with 01 or 02.
        </p>
      )}

      <button
        onClick={handleConnect}
        className="w-full px-4 py-3.5 bg-primary text-white text-sm font-semibold rounded-2xl hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all active:scale-[0.98]"
      >
        Connect & Analyze
      </button>

      <button
        onClick={handleDemo}
        className="w-full px-4 py-3 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
      >
        Try demo
      </button>
    </div>
  )
}
