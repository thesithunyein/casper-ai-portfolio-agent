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
      <button className="w-9 h-9 rounded-lg stripe-glass border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center opacity-0">
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 rounded-lg stripe-glass border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center hover:shadow-stripe-sm transition-all duration-300"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 text-amber-500 absolute transition-all duration-300 rotate-0 scale-100 dark:rotate-90 dark:scale-0 dark:opacity-0" />
      <Moon className="w-4 h-4 text-indigo-400 absolute transition-all duration-300 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
    </button>
  )
}
