/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        'warm-white': '#FFFEFB',
        charcoal: '#1A1A18',
        mink: '#8C7B6B',
        blush: '#D4A896',
        gold: '#C9A96E',
        'gold-light': '#E8D5B0',
        'text-light': '#6B635C',
        border: '#E8E2DA',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px pour la hauteur de navbar
      },
      scale: {
        '106': '1.06',
        '108': '1.08',
      },
    },
  },
  plugins: [],
}
