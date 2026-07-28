'use client'

/** CasperAgent lime brand mark (cache-busted path for CDN). */
export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand-mark.png"
      alt="CasperAgent"
      width={64}
      height={64}
      className={className}
      draggable={false}
    />
  )
}
