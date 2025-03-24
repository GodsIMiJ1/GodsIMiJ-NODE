/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'ghost-dark': '#121212',
        'neon-purple': '#9333EA',
        'neon-cyan': '#06B6D4',
        'ghost-gray': '#272727',
      },
    },
  },
  plugins: [],
};
