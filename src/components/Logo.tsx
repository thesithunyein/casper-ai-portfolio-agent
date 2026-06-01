'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition duration-300" />
      
      {/* Main app icon - Cute Bear */}
      <div className="relative bg-gradient-to-br from-primary via-cyan-400 to-secondary rounded-3xl p-0 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition duration-300 transform group-hover:scale-110 aspect-square">
        
        {/* Premium glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10 rounded-3xl" />
        
        {/* Cute Bear Face */}
        <svg viewBox="0 0 64 64" className="w-10 h-10 relative z-10">
          {/* Ears */}
          <circle cx="16" cy="18" r="8" fill="white" />
          <circle cx="48" cy="18" r="8" fill="white" />
          
          {/* Inner ear */}
          <circle cx="16" cy="18" r="4" fill="#ffb6c1" opacity="0.6" />
          <circle cx="48" cy="18" r="4" fill="#ffb6c1" opacity="0.6" />
          
          {/* Main face */}
          <circle cx="32" cy="34" r="18" fill="white" />
          
          {/* Eyes */}
          <circle cx="24" cy="30" r="2.5" fill="#1a1a2e" />
          <circle cx="40" cy="30" r="2.5" fill="#1a1a2e" />
          
          {/* Eye shine */}
          <circle cx="25" cy="29" r="0.8" fill="white" />
          <circle cx="41" cy="29" r="0.8" fill="white" />
          
          {/* Nose */}
          <ellipse cx="32" cy="36" rx="3" ry="2.5" fill="#ffb6c1" />
          
          {/* Mouth */}
          <path d="M 28 42 Q 32 46 36 42" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          
          {/* Cheeks */}
          <circle cx="20" cy="36" r="3" fill="#ffb6c1" opacity="0.5" />
          <circle cx="44" cy="36" r="3" fill="#ffb6c1" opacity="0.5" />
        </svg>
        
        {/* Subtle shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
      </div>
    </div>
  )
}
