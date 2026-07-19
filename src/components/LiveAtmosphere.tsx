'use client'

import { useEffect } from 'react'
import { usePointerField } from '@/components/PointerEffects'

/** Soft live atmosphere — drifting orbs, grid, and cursor-reactive light. */
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
  const parallaxX = (point.x - 0.5) * 28
  const parallaxY = (point.y - 0.5) * 20

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#f5f5f7] dark:bg-[#0a0a0c]" />

      {/* Cursor light field */}
      <div
        className="absolute inset-0 transition-[opacity] duration-700 ease-out"
        style={{
          opacity: active ? 1 : 0.5,
          background: `radial-gradient(560px circle at ${px}% ${py}%, rgba(99,91,255,0.18), transparent 58%)`,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light dark:mix-blend-screen transition-[opacity] duration-700 ease-out"
        style={{
          opacity: active ? 0.55 : 0.25,
          background: `radial-gradient(300px circle at ${px}% ${py}%, rgba(255,255,255,0.7), transparent 55%)`,
        }}
      />

      {/* Parallax wrappers keep CSS orb animations intact */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${parallaxX * 0.55}px, ${parallaxY * 0.45}px, 0)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <div className="atmosphere-orb atmosphere-orb-a" />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${-parallaxX * 0.35}px, ${parallaxY * 0.3}px, 0)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <div className="atmosphere-orb atmosphere-orb-b" />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${parallaxX * 0.2}px, ${-parallaxY * 0.25}px, 0)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <div className="atmosphere-orb atmosphere-orb-c" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,91,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,91,255,0.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 72%)',
          transform: `translate3d(${parallaxX * 0.12}px, ${parallaxY * 0.08}px, 0)`,
        }}
      />

      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] mix-blend-overlay atmosphere-noise" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 40%, transparent 35%, rgba(10,10,12,0.045) 100%)',
        }}
      />
    </div>
  )
}
