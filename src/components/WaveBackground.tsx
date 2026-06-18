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
      {/* Base layer with a soft blue tint so waves are visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-blue-50/60" />

      {/* Top-left ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl" />
      {/* Bottom-right ambient glow */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl" />

      {/* Wave Layer 1 — slowest, deep blue */}
      <div className="absolute bottom-0 left-0 w-[200%] wave-layer-1">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[320px] md:h-[440px]"
        >
          <path
            fill="rgba(59, 130, 246, 0.35)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Wave Layer 2 — medium speed, cyan */}
      <div className="absolute bottom-0 left-0 w-[200%] wave-layer-2">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[260px] md:h-[360px]"
        >
          <path
            fill="rgba(6, 182, 212, 0.45)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Wave Layer 3 — fastest, bright sky */}
      <div className="absolute bottom-0 left-0 w-[200%] wave-layer-3">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[200px] md:h-[280px]"
        >
          <path
            fill="rgba(14, 165, 233, 0.50)"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Floating particles — more visible */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-sky-500/40 animate-float-particle"
            style={{
              width: `${6 + Math.random() * 10}px`,
              height: `${6 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
