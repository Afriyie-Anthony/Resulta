import { defineConfig } from 'tailwindcss'

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        primary: ['Manrope', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#123B5D',
        secondary: '#0F8B8D',
        accent: '#E2B93B',
        warm: '#F8F7F2',
        surface: '#FFFFFF',
        'text-primary': '#172B3A',
        'text-secondary': '#5B6873',
        border: '#DCE3E7',
        success: '#15803D',
        warning: '#B7791F',
        error: '#C53030',
        info: '#2563EB',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
})