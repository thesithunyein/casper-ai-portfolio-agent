import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <div className="galaxy-bg" />
      <div className="relative z-10 text-center px-4">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">404</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved to another location.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
