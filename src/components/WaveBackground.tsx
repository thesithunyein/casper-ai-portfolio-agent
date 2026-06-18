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
      {/* Deep gradient base that makes waves pop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 30%, #dbeafe 60%, #bfdbfe 100%)',
        }}
      />

      {/* Animated gradient orb - top right */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulseOrb 8s ease-in-out infinite',
        }}
      />

      {/* Animated gradient orb - bottom left */}
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'pulseOrb 10s ease-in-out infinite reverse',
        }}
      />

      {/* Animated gradient orb - center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulseOrb 12s ease-in-out infinite',
        }}
      />

      {/* Wave 1 - top, slowest */}
      <div
        className="absolute top-0 left-0 w-[200%]"
        style={{ animation: 'waveSlide 20s linear infinite' }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[200px] md:h-[280px]"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path
            fill="rgba(59, 130, 246, 0.25)"
            d="M0,160L48,154.7C96,149,192,139,288,133.3C384,128,480,128,576,138.7C672,149,768,171,864,176C960,181,1056,171,1152,160C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Wave 2 - middle */}
      <div
        className="absolute top-[15%] left-0 w-[200%]"
        style={{ animation: 'waveSlide 15s linear infinite reverse' }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[150px] md:h-[200px]"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path
            fill="rgba(14, 165, 233, 0.2)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Wave 3 - bottom, fastest */}
      <div
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ animation: 'waveSlide 12s linear infinite' }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[250px] md:h-[350px]"
        >
          <path
            fill="rgba(37, 99, 235, 0.35)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Wave 4 - bottom overlay */}
      <div
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ animation: 'waveSlide 18s linear infinite reverse' }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[180px] md:h-[260px]"
        >
          <path
            fill="rgba(6, 182, 212, 0.3)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Floating bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const size = 8 + (i % 5) * 6
          const left = (i * 7.3) % 100
          const top = (i * 11.7) % 80
          const delay = (i * 0.7) % 8
          const duration = 10 + (i % 6) * 3
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: i % 3 === 0
                  ? 'rgba(14, 165, 233, 0.35)'
                  : i % 3 === 1
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(6, 182, 212, 0.25)',
                animation: `floatBubble ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
