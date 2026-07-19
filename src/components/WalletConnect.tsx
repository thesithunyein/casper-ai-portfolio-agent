'use client'

import { useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { validateCasperAddress } from '@/lib/casper'
import { MagneticButton } from '@/components/PointerEffects'

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
    <div className="w-full text-left space-y-3.5">
      <label className="block text-[11px] font-medium text-ink-400 dark:text-ink-500 tracking-wide text-center">
        Public key
      </label>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setTouched(true)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
          placeholder="01… or 02…"
          className={`w-full px-4 py-[15px] bg-white/80 dark:bg-white/[0.06] border text-ink-900 dark:text-white placeholder-ink-400/80 focus:outline-none font-mono text-[13px] md:text-sm rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(99,91,255,0.12)] ${
            showError
              ? 'border-red-300/80 focus:border-red-400'
              : isValid && input.trim()
                ? 'border-emerald-300/70 focus:border-emerald-400'
                : 'border-black/[0.08] dark:border-white/[0.1] focus:border-primary/50'
          }`}
        />
      </div>
      {showError && (
        <p className="text-xs text-red-500/90 text-center animate-fade-in">
          Must be 66–68 characters starting with 01 or 02.
        </p>
      )}

      <MagneticButton
        onClick={handleConnect}
        className="w-full px-4 py-[15px] bg-primary text-white text-[15px] font-semibold rounded-[14px] hover:bg-[#5a4dff] shadow-[0_1px_2px_rgba(99,91,255,0.25),0_8px_24px_rgba(99,91,255,0.28)] hover:shadow-[0_1px_2px_rgba(99,91,255,0.3),0_12px_32px_rgba(99,91,255,0.35)] active:scale-[0.985]"
      >
        Connect & Analyze
      </MagneticButton>

      <button
        onClick={handleDemo}
        className="w-full px-4 py-3 text-[14px] font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors rounded-[14px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
      >
        Try demo
      </button>
    </div>
  )
}
