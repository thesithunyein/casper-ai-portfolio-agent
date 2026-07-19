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

/** Shared atmosphere + nav — matches the minimal Agent running screen. */
export const AppShell = ({
  children,
  rightSlot,
  onLogoClick,
  centered = false,
  footer,
}: AppShellProps) => {
  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden">
      <LiveAtmosphere />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-16 shrink-0">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group"
        >
          <Logo className="w-7 h-7 transition-transform duration-500 group-hover:rotate-12" />
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
          centered ? 'justify-center pb-12' : 'pb-12 pt-4'
        }`}
      >
        {children}
      </div>

      {footer && (
        <div className="relative z-10 shrink-0 px-6 lg:px-10 pb-10">
          {footer}
        </div>
      )}
    </main>
  )
}
