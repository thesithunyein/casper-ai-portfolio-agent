'use client'

import { AlertCircle, Heart, Sparkles } from 'lucide-react'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border-2 border-gray-100 rounded-3xl shadow-xl animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <Heart className="absolute -top-2 -right-4 w-5 h-5 text-cute-dark animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-4 w-5 h-5 text-yellow-400 animate-bounce" />
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-red-500 mb-2">Oopsie!</h2>
        <p className="text-gray-600">{error}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Try Again
        </button>
      )}
    </div>
  )
}
