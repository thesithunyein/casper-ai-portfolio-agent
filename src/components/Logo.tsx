'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        {/* Outer diamond frame */}
        <path d="M20 2L37 20L20 38L3 20Z" stroke="url(#logoGrad)" strokeWidth="2" fill="none" />
        {/* Inner solid diamond */}
        <path d="M20 8L31 20L20 32L9 20Z" fill="url(#logoGrad)" opacity="0.25" />
        {/* Center vertical accent */}
        <path d="M20 12V28" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Center horizontal dot */}
        <circle cx="20" cy="20" r="3" fill="url(#logoGrad)" />
        <defs>
          <linearGradient id="logoGrad" x1="3" y1="2" x2="37" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
