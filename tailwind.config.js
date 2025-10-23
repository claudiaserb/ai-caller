/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: '#0F1222',
          surface: '#1A1D2E',
          text: '#E5E7EB',
          muted: '#9CA3AF',
        },
        // Light theme colors
        light: {
          bg: '#F5F7FB',
          surface: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
        },
        // Accent colors
        accent: {
          primary: '#6C63FF',
          secondary: '#B47EE5',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}