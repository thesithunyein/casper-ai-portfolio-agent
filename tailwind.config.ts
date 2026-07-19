import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#DFFF00',
        'primary-ink': '#0A0A0A',
        'primary-hover': '#C8E600',
        secondary: '#0A0A0A',
        accent: '#DFFF00',
        muted: '#6b7280',
        border: 'rgba(0,0,0,0.08)',
        'border-strong': 'rgba(0,0,0,0.14)',
        surface: 'rgba(0,0,0,0.02)',
        'surface-alt': 'rgba(0,0,0,0.04)',
        ink: {
          50: '#f7f7f5',
          100: '#f0f0ec',
          200: '#e5e5e0',
          300: '#d1d1cb',
          400: '#9a9a92',
          500: '#6b6b64',
          600: '#4a4a45',
          700: '#33332f',
          800: '#1c1c1a',
          900: '#0A0A0A',
          950: '#050505',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        'stripe-sm': '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
        'stripe-md': '0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06)',
        'stripe-lg': '0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
        'stripe-glow': '0 0 0 1px rgba(223,255,0,0.2), 0 4px 16px rgba(223,255,0,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
