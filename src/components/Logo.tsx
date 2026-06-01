'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
      
      {/* Main logo container */}
      <div className="relative bg-gradient-to-br from-primary to-secondary rounded-xl p-3 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition duration-300 transform group-hover:scale-105">
        {/* Inner circle with pattern */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Geometric background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-lg" />
          
          {/* Logo text with premium styling */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="text-white font-black text-sm tracking-widest leading-none">
              INJ
            </div>
            <div className="text-white/80 text-xs font-semibold tracking-wider mt-0.5">
              AI
            </div>
          </div>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition duration-300 transform -skew-x-12" />
    </div>
  )
}
