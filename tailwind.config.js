/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // scan all your source files
    './src/index.css',             // scan your main CSS for @apply rules
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};