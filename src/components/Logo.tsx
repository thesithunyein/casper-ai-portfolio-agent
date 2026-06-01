'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition duration-300" />
      
      {/* Main app icon - Bear logo */}
      <div className="relative bg-gradient-to-br from-primary via-cyan-400 to-secondary rounded-3xl p-0 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition duration-300 transform group-hover:scale-110 aspect-square">
        
        {/* Premium glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10 rounded-3xl" />
        
        {/* Bear head - SVG style with CSS */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main head circle */}
          <div className="absolute w-12 h-12 bg-white/90 rounded-full" />
          
          {/* Left ear */}
          <div className="absolute w-3 h-4 bg-white/90 rounded-full top-1 left-2 transform -rotate-12" />
          
          {/* Right ear */}
          <div className="absolute w-3 h-4 bg-white/90 rounded-full top-1 right-2 transform rotate-12" />
          
          {/* Left eye */}
          <div className="absolute w-2 h-2.5 bg-gray-900 rounded-full top-5 left-5" />
          
          {/* Right eye */}
          <div className="absolute w-2 h-2.5 bg-gray-900 rounded-full top-5 right-5" />
          
          {/* Nose */}
          <div className="absolute w-1.5 h-1.5 bg-gray-900 rounded-full top-7" />
          
          {/* Mouth - simple curved line effect */}
          <div className="absolute top-8 w-2 h-1 bg-gray-900 rounded-full" />
          <div className="absolute top-8 left-4 w-1 h-0.5 bg-gray-900 rounded-full" />
          <div className="absolute top-8 right-4 w-1 h-0.5 bg-gray-900 rounded-full" />
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
      </div>
    </div>
  )
}
