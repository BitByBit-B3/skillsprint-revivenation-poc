/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        'background-secondary': '#0B0B10',
        foreground: '#E5E5E5',
        'foreground-secondary': '#A3A3A3',
        border: '#262626',
        'border-secondary': '#404040',
        accent: {
          emerald: '#10B981',
          cyan: '#06B6D4',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(0, 0, 0, 0.4)',
        'soft-lg': '0 8px 40px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}