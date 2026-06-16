'use client'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-xl blur opacity-80" />
      <div className="relative w-full max-w-sm p-6 bg-galaxy-800/80 backdrop-blur-md border border-red-500/30 rounded-xl animate-fade-in">
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold rounded">ERROR</span>
        </div>
        <h2 className="text-sm font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
