import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function ComingSoon() {
  return (
    <main className="relative min-h-screen">
      <div className="galaxy-bg">
        <div className="twinkle-layer" />
        <div className="shooting-star" />
        <div className="shooting-star" />
        <div className="shooting-star" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-galaxy-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-300">
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-sm text-white tracking-tight">Casper Agent</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center max-w-lg animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-neon-cyan mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            In Development
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Soon</span>
          </h1>

          <p className="text-base text-gray-300 mb-8 leading-relaxed">
            This feature is currently under development. Stay tuned for updates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
            <a
              href="https://github.com/thesithunyein/casper-ai-portfolio-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Follow on GitHub
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Testnet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
              x402 Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              Open Source
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
