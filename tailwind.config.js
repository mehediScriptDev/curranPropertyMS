/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // Exact palette from reference
        primary: {
          50: "#effefb",
          100: "#c8fff4",
          200: "#91feea",
          300: "#53f5dd",
          400: "#1edeca",
          500: "#0bb8a8", // Main teal buttons
          600: "#079489", // Teal darker
          700: "#0a766f",
          800: "#0d5d59",
          900: "#104d4a",
        },
        dark: {
          50: "#f0f5fa",
          100: "#dae4f0",
          200: "#b8cce1",
          300: "#8aabc9",
          400: "#5b86ad",
          500: "#3f6a93",
          600: "#31547b",
          700: "#2a4564",
          800: "#263c55",
          900: "#1b2d40",
          950: "#0f1c2e", // Darkest navy for hero overlays / footer
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
