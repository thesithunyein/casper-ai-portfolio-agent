'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full drop-shadow-[0_1px_2px_rgba(99,91,255,0.25)]"
        fill="none"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id="caMark" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7a73ff" />
            <stop offset="55%" stopColor="#635bff" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="caSheen" x1="8" y1="4" x2="20" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft squircle — matches product radius language */}
        <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="url(#caMark)" />
        <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="url(#caSheen)" />

        {/* Agent node + orbit — reads at favicon size */}
        <circle cx="16" cy="16" r="7.25" stroke="white" strokeOpacity="0.28" strokeWidth="1.25" />
        <circle cx="16" cy="16" r="3.35" fill="white" fillOpacity="0.96" />
        <circle cx="22.4" cy="11.2" r="1.55" fill="white" fillOpacity="0.9" />
        <path
          d="M18.6 13.6C19.7 12.7 20.9 12 22.1 11.5"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
