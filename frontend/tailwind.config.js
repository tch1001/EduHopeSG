/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        "xs": "425px"
      },
      colors: {
        "white": "#FFFDFA",
        "blue": "#ADD8E6",
        "sky-blue": "#A3C8D9",
        "aqua": "#205e6f",
        "dark-blue": "#075983",
        "neutral": {
          100: "#2C2C2C"
        }
      }
    },
  },
  plugins: [],
}
