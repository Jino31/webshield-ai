import { themeColors } from './src/style/colors.js';

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
        deep: themeColors.deep,
        card: themeColors.card,
        elevated: themeColors.elevated,
        borderline: themeColors.borderline,
        primary: themeColors.primary,
        secondary: themeColors.secondary,
      },
    },
  },
  plugins: [],
}