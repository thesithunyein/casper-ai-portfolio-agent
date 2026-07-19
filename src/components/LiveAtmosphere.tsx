'use client'

import { useEffect } from 'react'
import { usePointerField } from '@/components/PointerEffects'

/** Soft live atmosphere — lime brand glow + quiet orbs. */
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
  const parallaxX = (point.x - 0.5) * 10
  const parallaxY = (point.y - 0.5) * 8

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#f4f4f0] dark:bg-[#050505]" />

      {/* Light — soft lime cursor field */}
      <div
        className="absolute inset-0 dark:hidden transition-[opacity] duration-500 ease-out"
        style={{
          opacity: active ? 0.95 : 0.4,
          background: `radial-gradient(180px circle at ${px}% ${py}%, rgba(223,255,0,0.28), transparent 70%)`,
        }}
      />

      {/* Dark — brighter lime + soft white */}
      <div
        className="absolute inset-0 hidden dark:block transition-[opacity] duration-500 ease-out"
        style={{
          opacity: active ? 0.9 : 0.35,
          background: `radial-gradient(200px circle at ${px}% ${py}%, rgba(223,255,0,0.14), transparent 68%)`,
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block transition-[opacity] duration-500 ease-out"
        style={{
          opacity: active ? 0.25 : 0.1,
          background: `radial-gradient(120px circle at ${px}% ${py}%, rgba(255,255,255,0.08), transparent 65%)`,
        }}
      />

      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${parallaxX * 0.5}px, ${parallaxY * 0.4}px, 0)` }}
      >
        <div className="atmosphere-orb atmosphere-orb-a" />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${-parallaxX * 0.3}px, ${parallaxY * 0.25}px, 0)` }}
      >
        <div className="atmosphere-orb atmosphere-orb-b" />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${parallaxX * 0.15}px, ${-parallaxY * 0.2}px, 0)` }}
      >
        <div className="atmosphere-orb atmosphere-orb-c" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 72%)',
          transform: `translate3d(${parallaxX * 0.08}px, ${parallaxY * 0.05}px, 0)`,
        }}
      />

      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay atmosphere-noise" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 40%, transparent 40%, rgba(10,10,10,0.04) 100%)',
        }}
      />
    </div>
  )
}
