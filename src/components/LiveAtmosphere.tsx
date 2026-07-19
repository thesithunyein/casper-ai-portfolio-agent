'use client'

import { useEffect } from 'react'
import { usePointerField } from '@/components/PointerEffects'

/** Soft live atmosphere — very light cursor tint + quiet orbs. */
export const LiveAtmosphere = () => {
  const { point, active, onMove, onLeave } = usePointerField()

  useEffect(() => {
    const move = (e: MouseEvent) => onMove(e)
    const leave = () => onLeave()
    window.addEventListener('mousemove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [onMove, onLeave])

  const px = point.x * 100
  const py = point.y * 100
  // Minimal parallax — barely noticeable
  const parallaxX = (point.x - 0.5) * 4
  const parallaxY = (point.y - 0.5) * 3

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#f4f4f0] dark:bg-[#050505]" />

      {/* Light — whisper lime follow */}
      <div
        className="absolute inset-0 dark:hidden transition-[opacity] duration-700 ease-out"
        style={{
          opacity: active ? 0.55 : 0.22,
          background: `radial-gradient(110px circle at ${px}% ${py}%, rgba(223,255,0,0.12), transparent 72%)`,
        }}
      />

      {/* Dark — whisper lime follow */}
      <div
        className="absolute inset-0 hidden dark:block transition-[opacity] duration-700 ease-out"
        style={{
          opacity: active ? 0.4 : 0.15,
          background: `radial-gradient(120px circle at ${px}% ${py}%, rgba(223,255,0,0.07), transparent 72%)`,
        }}
      />

      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${parallaxX * 0.35}px, ${parallaxY * 0.3}px, 0)` }}
      >
        <div className="atmosphere-orb atmosphere-orb-a" />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${-parallaxX * 0.2}px, ${parallaxY * 0.15}px, 0)` }}
      >
        <div className="atmosphere-orb atmosphere-orb-b" />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${parallaxX * 0.1}px, ${-parallaxY * 0.12}px, 0)` }}
      >
        <div className="atmosphere-orb atmosphere-orb-c" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.14] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,10,10,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 72%)',
        }}
      />

      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay atmosphere-noise" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 40%, transparent 45%, rgba(10,10,10,0.03) 100%)',
        }}
      />
    </div>
  )
}
