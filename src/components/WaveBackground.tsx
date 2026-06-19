'use client'

import { useEffect, useState } from 'react'

export const WaveBackground = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 bg-white dark:bg-ink-950 transition-colors duration-500" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* Light gradient mesh — Stripe style */}
      <div className="dark:hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #635bff 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'meshFloat 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'meshFloat2 14s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'meshFloat 16s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Dark gradient mesh */}
      <div className="hidden dark:block">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #635bff 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'meshFloat 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'meshFloat2 14s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'meshFloat 16s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>
    </div>
  )
}
