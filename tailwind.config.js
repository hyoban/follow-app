/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/dom/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
