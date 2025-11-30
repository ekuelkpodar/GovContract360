/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f6ff',
          100: '#e1edff',
          200: '#bcd6ff',
          300: '#8ab5ff',
          400: '#5a8dff',
          500: '#2f5fff',
          600: '#2148db',
          700: '#1736aa',
          800: '#132c84',
          900: '#0f2368'
        }
      }
    }
  },
  plugins: []
};
