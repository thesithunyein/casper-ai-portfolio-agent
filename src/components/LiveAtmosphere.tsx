'use client'

/** Soft live atmosphere — drifting orbs + grid. Quiet motion, not noise. */
export const LiveAtmosphere = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-ink-50 dark:bg-ink-950" />

      <div className="atmosphere-orb atmosphere-orb-a" />
      <div className="atmosphere-orb atmosphere-orb-b" />
      <div className="atmosphere-orb atmosphere-orb-c" />

      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,91,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,91,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
        }}
      />

      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay atmosphere-noise" />
    </div>
  )
}
