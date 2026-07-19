'use client'

import { useId } from 'react'

/**
 * CasperAgent mark — vector squircle + continuous loop→arrow.
 * Exact brand: lime #DFFF00 tile, black stroke (transparent outside).
 */
export const Logo = ({ className = '' }: { className?: string }) => {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      aria-hidden
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect width="64" height="64" rx="14" />
        </clipPath>
      </defs>

      {/* Transparent outside — only the squircle is painted */}
      <g clipPath={`url(#clip-${uid})`}>
        <rect width="64" height="64" rx="14" fill="#DFFF00" />

        {/* Continuous growth path: stem → loop → exit */}
        <path
          d="M17.5 48
             V33.5
             C17.5 21.2 25.8 15.2 36.2 15.2
             C48.2 15.2 54.8 23.8 54.8 34.2
             C54.8 44.8 47.2 51.5 36.8 51.5
             C28.8 51.5 23.5 46.2 23.5 39.2
             C23.5 31.8 29.8 27.2 38.2 27.2
             L49.5 17.8"
          stroke="#0A0A0A"
          strokeWidth="7.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrowhead — solid, aligned to exit stroke */}
        <path
          d="M42.2 12.8 L55.2 11.6 L51.4 24.2 Z"
          fill="#0A0A0A"
        />
      </g>
    </svg>
  )
}
