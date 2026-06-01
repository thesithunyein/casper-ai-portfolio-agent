'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition duration-300" />
      
      {/* Main app icon - Apple style rounded square */}
      <div className="relative bg-gradient-to-br from-primary via-cyan-400 to-secondary rounded-2xl p-0 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition duration-300 transform group-hover:scale-110 aspect-square">
        
        {/* Premium glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10 rounded-2xl" />
        
        {/* Inner content */}
        <div className="relative flex flex-col items-center justify-center gap-0.5">
          {/* Large INJ text */}
          <div className="text-white font-black text-xl tracking-tighter leading-none">
            INJ
          </div>
          {/* Small AI text */}
          <div className="text-white font-bold text-xs tracking-wider">
            AI
          </div>
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
      </div>
    </div>
  )
}
