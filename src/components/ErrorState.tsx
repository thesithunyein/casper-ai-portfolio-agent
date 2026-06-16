'use client'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="w-full max-w-sm p-6 bg-surface border border-red-600/30 animate-fade-in">
      <div className="mb-4">
        <span className="inline-block px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold">ERROR</span>
      </div>
      <h2 className="text-sm font-semibold text-black mb-2">Something went wrong</h2>
      <p className="text-xs text-muted leading-relaxed mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
