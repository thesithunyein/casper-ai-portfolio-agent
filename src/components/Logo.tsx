'use client'

/** Exact CasperAgent mark from brand asset (transparent outside squircle). */
export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon.png"
      alt=""
      width={64}
      height={64}
      className={className}
      draggable={false}
    />
  )
}
