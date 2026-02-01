/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19340',
          500: '#ee751b',
          600: '#df5a11',
          700: '#b94310',
          800: '#933615',
          900: '#772f14',
        },
        secondary: {
          50: '#f6f6f7',
          100: '#e1e3e6',
          200: '#c3c6cd',
          300: '#9da2ad',
          400: '#787e8c',
          500: '#5d6371',
          600: '#4a4e5a',
          700: '#3e414a',
          800: '#35373f',
          900: '#1a1b1f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
