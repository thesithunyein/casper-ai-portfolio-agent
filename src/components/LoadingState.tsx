'use client'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({
  message = 'Analyzing portfolio...',
}: LoadingStateProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/30 to-neon-purple/30 rounded-xl blur opacity-80" />
      <div className="relative w-full max-w-sm p-6 bg-galaxy-800/80 backdrop-blur-md border border-white/10 rounded-xl flex flex-col items-center justify-center min-h-48 animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center mb-4">
          <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-white text-center font-medium">{message}</p>
        <p className="text-xs font-mono text-muted mt-2">This may take a few seconds</p>
      </div>
    </div>
  )
}
