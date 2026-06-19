'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children, ...props }: { children: ReactNode } & Omit<React.ComponentProps<typeof NextThemesProvider>, 'children'>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
