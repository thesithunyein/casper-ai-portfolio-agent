'use client'

/** Official CasperAgent mark — neon lime squircle + black C→arrow. */
export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        fill="none"
        shapeRendering="geometricPrecision"
      >
        <rect width="64" height="64" rx="14" fill="#DFFF00" />
        <path
          d="M16 46V34C16 22 24 16 34 16C46 16 52 25 52 34C52 44 44 50 34 50C26 50 22 45 22 39C22 32 28 28 36 28L46 20"
          stroke="#0A0A0A"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M39.5 14.5L52 14L48.5 26Z" fill="#0A0A0A" />
      </svg>
    </div>
  )
}
