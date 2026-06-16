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
      },
      keyframes: {
        "zoom-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.15)", opacity: 0.8 },
        }
      },
      animation: {
        "zoom-pulse": "zoom-pulse 1.5s ease-in-out infinite",
      }
    },
  },
  plugins: [],
}
