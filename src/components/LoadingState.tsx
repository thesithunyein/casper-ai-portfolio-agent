'use client'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({
  message = 'Analyzing portfolio...',
}: LoadingStateProps) => {
  return (
    <div className="w-full max-w-sm p-6 bg-surface border border-border flex flex-col items-center justify-center min-h-48 animate-fade-in">
      <div className="w-8 h-8 bg-black flex items-center justify-center mb-4">
        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-black text-center font-medium">{message}</p>
      <p className="text-xs font-mono text-muted mt-2">This may take a few seconds</p>
    </div>
  )
}
