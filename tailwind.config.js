/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#115746",
          "green-dk": "#0d4035",
          "green-lt": "#e8f5f0",
          orange: "#FA4812",
          yellow: "#FFC92A",
          cream: "#FDF4D7",
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      }
    },
  },
  plugins: [],
}
