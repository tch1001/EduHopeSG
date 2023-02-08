/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "blue": "#ADD8E6",
        "neutral": {
          100: "#2C2C2C"
        }
      }
    },
  },
  plugins: [],
}
