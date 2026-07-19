'use client'

import { ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LiveAtmosphere } from '@/components/LiveAtmosphere'

interface AppShellProps {
  children: ReactNode
  rightSlot?: ReactNode
  onLogoClick?: () => void
  /** Center content vertically (home / running). Default false for scrollable results. */
  centered?: boolean
  /** Optional footer strip below main content (home essentials). */
  footer?: ReactNode
}

/** Shared atmosphere + nav — product shell. */
export const AppShell = ({
  children,
  rightSlot,
  onLogoClick,
  centered = false,
  footer,
}: AppShellProps) => {
  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/20 selection:text-ink-900 dark:selection:text-white">
      <LiveAtmosphere />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-[60px] shrink-0">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group rounded-full px-1.5 py-1 -ml-1.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors duration-300"
        >
          <Logo className="w-8 h-8 transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
          <span className="font-semibold text-[15px] text-ink-900 dark:text-white tracking-[-0.02em]">
            Casper Agent
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {rightSlot}
        </div>
      </nav>

      <div
        className={`relative z-10 flex-1 flex flex-col px-6 lg:px-10 ${
          centered ? 'justify-center pb-14' : 'pb-14 pt-6'
        }`}
      >
        {children}
      </div>

      {footer && (
        <div className="relative z-10 shrink-0 px-6 lg:px-10 pb-11">
          {footer}
        </div>
      )}
    </main>
  )
}
