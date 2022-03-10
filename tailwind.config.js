module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'regal-blue': '#0077b6',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss'),
    require('autoprefixer')
  ],
}
