'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-full border border-transparent opacity-0">
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 rounded-full bg-white/60 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl flex items-center justify-center hover:bg-white/90 dark:hover:bg-white/[0.1] active:scale-95 transition-all duration-300 touch-manipulation shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 text-amber-500 absolute transition-all duration-400 rotate-0 scale-100 dark:rotate-90 dark:scale-0 dark:opacity-0" />
      <Moon className="w-4 h-4 text-indigo-300 absolute transition-all duration-400 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
    </button>
  )
}
