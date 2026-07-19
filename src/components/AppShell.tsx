'use client'

import { ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'

interface AppShellProps {
  children: ReactNode
  rightSlot?: ReactNode
  onLogoClick?: () => void
  /** Center content vertically (home / running). Default false for scrollable results. */
  centered?: boolean
}

/** Shared atmosphere + nav — matches the minimal Agent running screen. */
export const AppShell = ({
  children,
  rightSlot,
  onLogoClick,
  centered = false,
}: AppShellProps) => {
  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden bg-ink-50 dark:bg-ink-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,91,255,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(16,185,129,0.08), transparent 50%)',
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-16 shrink-0">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group"
        >
          <Logo className="w-7 h-7" />
          <span className="font-semibold text-[15px] text-ink-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
            Casper Agent
          </span>
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {rightSlot}
        </div>
      </nav>

      <div
        className={`relative z-10 flex-1 flex flex-col px-6 lg:px-10 ${
          centered ? 'justify-center pb-20' : 'pb-16 pt-4'
        }`}
      >
        {children}
      </div>
    </main>
  )
}
