'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function MouseGlow() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 })
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <>
      {/* Cursor glow - follows mouse */}
      <div
        className="fixed pointer-events-none z-[9999] hidden lg:block transition-transform duration-100 ease-out"
        style={{
          left: position.x - 150,
          top: position.y - 150,
          width: 300,
          height: 300,
          background: isDark
            ? 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          transform: `translate(0, 0)`,
          willChange: 'left, top',
        }}
      />
      {/* Smaller bright center dot */}
      <div
        className="fixed pointer-events-none z-[9999] hidden lg:block"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          width: 8,
          height: 8,
          background: isDark ? 'rgba(147,197,253,0.6)' : 'rgba(59,130,246,0.4)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          willChange: 'left, top',
          transition: 'left 0.05s ease-out, top 0.05s ease-out',
        }}
      />
    </>
  )
}
