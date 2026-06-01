import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Injective Agent - AI Portfolio Analysis',
  description: 'AI-powered portfolio analysis and rebalancing for Injective blockchain',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#06b6d4',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        {children}
      </body>
    </html>
  )
}
