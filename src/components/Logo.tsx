'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
        {/* Solid outer diamond */}
        <path d="M16 2L30 16L16 30L2 16Z" fill="url(#logoGrad)" />
        {/* Inner cutout creating a hexagon negative space */}
        <path d="M16 8L24 16L16 24L8 16Z" fill="#0a0a1a" />
        {/* Center accent diamond */}
        <path d="M16 12L20 16L16 20L12 16Z" fill="url(#logoGrad)" opacity="0.9" />
        <defs>
          <linearGradient id="logoGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
