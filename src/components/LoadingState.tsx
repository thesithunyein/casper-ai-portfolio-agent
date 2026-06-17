'use client'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({
  message = 'Analyzing portfolio...',
}: LoadingStateProps) => {
  return (
    <div className="relative group animate-fade-in">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/30 to-neon-purple/30 rounded-xl blur opacity-80" />
      <div className="relative w-full max-w-sm p-8 bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl flex flex-col items-center justify-center min-h-52">
        {/* Shimmer skeleton */}
        <div className="w-12 h-12 rounded-xl animate-shimmer mb-5" />
        <div className="w-40 h-4 rounded animate-shimmer mb-3" />
        <div className="w-24 h-3 rounded animate-shimmer mb-6" />

        <p className="text-sm text-white text-center font-medium">{message}</p>
        <p className="text-xs font-mono text-muted mt-2">This may take a few seconds</p>
      </div>
    </div>
  )
}
