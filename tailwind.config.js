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
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      keyframes: {
        "zoom-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.15)", opacity: 0.8 },
        },
        "toast-in": {
          from: { transform: "translateY(-8px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "toast-timer": {
          from: { transform: "scaleX(1)" },
          to: { transform: "scaleX(0)" },
        },
        "badge-pulse": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(250,72,18,0.6)" },
          "30%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 8px rgba(250,72,18,0)" },
        }
      },
      animation: {
        "zoom-pulse": "zoom-pulse 1.5s ease-in-out infinite",
        "toast-in": "toast-in 0.25s ease-out",
        "toast-timer": "toast-timer 10s linear forwards",
        "badge-pulse": "badge-pulse 0.9s ease-out 2",
      }
    },
  },
  plugins: [],
}
