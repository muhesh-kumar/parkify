/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primaryBackground: '#2B2B2B',
        secondaryBackground: '#4A4B45',
        selected: '#565541',
        fontSelected: '#E9DE1D',
      },
    },
  },
  plugins: [],
};
