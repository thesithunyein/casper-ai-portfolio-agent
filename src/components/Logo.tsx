'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#635bff" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logoGrad)" />
        <path d="M16 8L22 16L16 24L10 16Z" fill="white" fillOpacity="0.95" />
        <path d="M16 11L19.5 16L16 21L12.5 16Z" fill="url(#logoGrad)" />
      </svg>
    </div>
  )
}
