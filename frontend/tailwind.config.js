/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#7C3AED",
        brandDark: "#6D28D9",
        brandDarker: "#5B21B6",
        brandLight: "#B794F4",
        brandBackground: "#FAF5FF"
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        }
      },
      animation: {
        gradient: "gradient 15s ease infinite"
      }
    }
  },
  safelist: [
    'text-brand',
    'text-brandDark',
    'text-brandDarker',
    'text-brandLight',
    'text-brandBackground',
    'border-brand',
    'border-brandDark',
    'border-brandLight',
    'bg-brand',
    'bg-brandDark',
    'bg-brandLight',
    'bg-brandBackground'
  ],
  darkMode: "class",
  plugins: [],
}
