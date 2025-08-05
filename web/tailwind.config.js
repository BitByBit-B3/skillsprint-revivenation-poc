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
        background: '#000000',
        'background-secondary': '#0A0A0A',
        foreground: '#FFFFFF',
        'foreground-secondary': '#888888',
        border: '#1A1A1A',
        'border-secondary': '#2A2A2A',
        accent: {
          emerald: '#00FF88',
          cyan: '#00D4FF',
        },
        success: '#00FF88',
        warning: '#FFB800',
        error: '#FF4444',
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