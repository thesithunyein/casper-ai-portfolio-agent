'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={className}>
      {/* Intentionally imperfect hand-coded mark — the human-feeling element */}
      <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
        <rect x="2" y="6" width="20" height="20" fill="black" />
        <rect x="18" y="2" width="12" height="12" fill="black" opacity="0.15" />
        <rect x="10" y="18" width="8" height="4" fill="white" />
      </svg>
    </div>
  )
}
