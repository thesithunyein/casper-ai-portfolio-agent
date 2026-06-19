'use client'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="relative group">
      <div className="relative w-full max-w-sm p-6 bg-white dark:bg-ink-900 border border-red-200 dark:border-red-500/20 rounded-xl shadow-stripe-md animate-fade-in">
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 border border-red-200 dark:border-red-500/20 text-[10px] font-mono font-bold rounded">ERROR</span>
        </div>
        <h2 className="text-sm font-semibold text-ink-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5a4dff] btn-shadow hover:btn-shadow-hover transition-all duration-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
