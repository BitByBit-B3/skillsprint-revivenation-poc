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
        background: '#121212',
        'background-secondary': '#1a1a1a',
        foreground: '#FFFFFF',
        'foreground-secondary': '#E4E4E4',
        border: '#2c2c2c',
        'border-secondary': '#292b2c',
        accent: {
          emerald: '#03DAC5',
          cyan: '#BB86FC',
        },
        success: '#03DAC5',
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