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
      {/* Base — soft blue tint across entire viewport */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50/80 to-cyan-50" />

      {/* Large animated blob 1 — top-left, blue */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          animation: 'blob 6s infinite',
        }}
      />

      {/* Large animated blob 2 — bottom-right, cyan */}
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          animation: 'blob 6s infinite',
          animationDelay: '2s',
        }}
      />

      {/* Large animated blob 3 — center-right, sky */}
      <div
        className="absolute top-1/3 right-1/4 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        style={{
          background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
          animation: 'blob 6s infinite',
          animationDelay: '4s',
        }}
      />

      {/* Wave at bottom — highly visible */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-[180px] md:h-[260px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(59, 130, 246, 0.35)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Second wave layer — offset */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-[140px] md:h-[200px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(14, 165, 233, 0.28)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  )
}
