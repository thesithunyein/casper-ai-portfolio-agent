'use client'

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
      <div className="relative bg-gradient-to-br from-primary to-secondary rounded-lg p-2 flex items-center justify-center">
        <div className="text-white font-black text-lg tracking-tighter">
          INJ
        </div>
      </div>
    </div>
  )
}
