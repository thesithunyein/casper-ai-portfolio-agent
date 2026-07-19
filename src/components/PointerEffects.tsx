'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Smooth pointer tracking for spotlight / parallax (rAF-throttled). */
export function usePointerField() {
  const target = useRef({ x: 0.5, y: 0.5 })
  const current = useRef({ x: 0.5, y: 0.5 })
  const [point, setPoint] = useState({ x: 0.5, y: 0.5 })
  const [active, setActive] = useState(false)
  const raf = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const tick = () => {
      const dx = target.current.x - current.current.x
      const dy = target.current.y - current.current.y
      current.current.x += dx * 0.08
      current.current.y += dy * 0.08
      setPoint({ x: current.current.x, y: current.current.y })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const onMove = useCallback((e: MouseEvent | globalThis.MouseEvent) => {
    if (prefersReducedMotion()) return
    const w = window.innerWidth || 1
    const h = window.innerHeight || 1
    target.current = { x: e.clientX / w, y: e.clientY / h }
    setActive(true)
  }, [])

  const onLeave = useCallback(() => {
    target.current = { x: 0.5, y: 0.4 }
    setActive(false)
  }, [])

  return { point, active, onMove, onLeave }
}

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

/** Card with a soft radial highlight that follows the cursor. */
export function SpotlightCard({
  children,
  className = '',
  href,
  onClick,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement | null>(null)
  const [style, setStyle] = useState<CSSProperties>({})

  const handleMove = (e: MouseEvent) => {
    if (prefersReducedMotion() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setStyle({
      background: `radial-gradient(160px circle at ${x}px ${y}px, rgba(223,255,0,0.18), transparent 70%)`,
    })
  }

  const handleLeave = () => setStyle({})

  const glow = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={style}
    />
  )

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`group relative overflow-hidden ${className}`}
      >
        {glow}
        <span className="relative z-[1] block">{children}</span>
      </a>
    )
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative overflow-hidden ${className}`}
    >
      {glow}
      <span className="relative z-[1] block">{children}</span>
    </div>
  )
}

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

/** Primary action with subtle magnetic pull toward the cursor. */
export function MagneticButton({
  children,
  onClick,
  className = '',
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMove = (e: MouseEvent) => {
    if (prefersReducedMotion() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setOffset({ x: x * 0.06, y: y * 0.09 })
  }

  const handleLeave = () => setOffset({ x: 0, y: 0 })

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative overflow-hidden !transform-none ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.45), transparent 55%)',
        }}
      />
      <span className="relative z-[1]">{children}</span>
    </button>
  )
}
