/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans all React files
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#16a34a',
          hover: '#15803d',
        }
      }
    },
  },
  plugins: [],
};
