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
      {/* Light mode base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/50 to-sky-50/70 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-900/90 transition-colors duration-500" />

      {/* Light blobs */}
      <div className="dark:hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)', filter: 'blur(80px)', animation: 'blob 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)', filter: 'blur(80px)', animation: 'blob 8s ease-in-out infinite', animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)', filter: 'blur(80px)', animation: 'blob 8s ease-in-out infinite', animationDelay: '5s' }} />
      </div>

      {/* Dark blobs */}
      <div className="hidden dark:block">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #1e3a5f 0%, transparent 70%)', filter: 'blur(80px)', animation: 'blob 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #1e40af 0%, transparent 70%)', filter: 'blur(80px)', animation: 'blob 8s ease-in-out infinite', animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #0c4a6e 0%, transparent 70%)', filter: 'blur(80px)', animation: 'blob 8s ease-in-out infinite', animationDelay: '5s' }} />
      </div>

      {/* Light waves */}
      <div className="dark:hidden absolute bottom-0 left-0 w-full">
        <svg className="w-full h-[160px] md:h-[220px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(59, 130, 246, 0.08)" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
      <div className="dark:hidden absolute bottom-0 left-0 w-full">
        <svg className="w-full h-[120px] md:h-[160px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(14, 165, 233, 0.06)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>

      {/* Dark waves */}
      <div className="hidden dark:block absolute bottom-0 left-0 w-full">
        <svg className="w-full h-[160px] md:h-[220px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(59, 130, 246, 0.15)" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
      <div className="hidden dark:block absolute bottom-0 left-0 w-full">
        <svg className="w-full h-[120px] md:h-[160px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(14, 165, 233, 0.10)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
    </div>
  )
}
