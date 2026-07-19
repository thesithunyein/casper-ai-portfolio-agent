'use client'

/** Exact CasperAgent mark — lime squircle + black loop-arrow (transparent outside). */
export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon.png"
      alt=""
      width={32}
      height={32}
      className={className}
      draggable={false}
    />
  )
}
