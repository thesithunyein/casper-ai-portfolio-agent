'use client'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({
  message = 'Analyzing portfolio...',
}: LoadingStateProps) => {
  return (
    <div className="relative group animate-fade-in">
      <div className="relative w-full max-w-sm p-8 bg-white dark:bg-ink-900 border border-black/[0.06] dark:border-white/[0.06] rounded-xl shadow-stripe-md flex flex-col items-center justify-center min-h-52">
        {/* Shimmer skeleton */}
        <div className="w-12 h-12 rounded-xl animate-shimmer mb-5" />
        <div className="w-40 h-4 rounded animate-shimmer mb-3" />
        <div className="w-24 h-3 rounded animate-shimmer mb-6" />

        <p className="text-sm text-ink-900 dark:text-white text-center font-medium">{message}</p>
        <p className="text-xs font-mono text-ink-400 dark:text-ink-500 mt-2">This may take a few seconds</p>
      </div>
    </div>
  )
}
