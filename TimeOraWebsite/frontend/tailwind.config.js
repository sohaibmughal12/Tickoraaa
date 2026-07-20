/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#000000",
          dark: "#121212",
          gray: "#1F1F1F",
          lightGray: "#2C2C2C",
          gold: "#D4AF37",
          goldHover: "#C59B27",
          goldLight: "#F3E5AB",
          silver: "#E5E7EB",
        }
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #121212 0%, #000000 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'luxury-soft': '0 4px 30px rgba(0, 0, 0, 0.4)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.2)',
      },
    },
  },
  plugins: [],
}
