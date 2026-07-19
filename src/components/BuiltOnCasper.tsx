'use client'

/** Official-style Casper Network attribution lockup. */
export const BuiltOnCasper = ({ className = '' }: { className?: string }) => {
  return (
    <a
      href="https://casper.network"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex flex-col items-center gap-2 group ${className}`}
    >
      <span className="text-[13px] font-semibold text-ink-900 dark:text-white tracking-tight">
        Built On
      </span>
      <span className="inline-flex items-center gap-2">
        <svg
          width="22"
          height="22"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="16" cy="16" r="16" fill="#E31337" />
          <path
            d="M22.2 11.2c-1.1-1.5-2.9-2.4-5-2.4-3.6 0-6.4 2.6-6.4 6.2v2c0 3.6 2.8 6.2 6.4 6.2 2.1 0 3.9-.9 5-2.4"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="20.6" y="8.2" width="2.8" height="2.8" rx="0.4" fill="white" />
        </svg>
        <span className="text-[15px] font-medium text-ink-500 dark:text-ink-300 group-hover:text-ink-900 dark:group-hover:text-white transition-colors tracking-[-0.01em]">
          Casper Network
        </span>
      </span>
    </a>
  )
}
