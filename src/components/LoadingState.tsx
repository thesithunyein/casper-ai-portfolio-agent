'use client'

import { Loader, Sparkles, Heart } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({
  message = 'Analyzing your portfolio with cute bear power...',
}: LoadingStateProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border-2 border-gray-100 rounded-3xl shadow-xl flex flex-col items-center justify-center min-h-64 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
        <Sparkles className="absolute -top-2 -right-4 w-5 h-5 text-cute-dark animate-bounce" />
        <Heart className="absolute -bottom-2 -left-4 w-5 h-5 text-red-400 animate-pulse" />
      </div>
      <p className="text-gray-800 text-center font-bold text-lg">{message}</p>
      <div className="mt-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-cute-dark animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}
