/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': {
          50: '#FDF9E7',
          100: '#FCF3CF',
          200: '#F9E69F',
          300: '#F6D96F',
          400: '#F3CC3F',
          500: '#D4AF37', // Notre couleur or principale
          600: '#A88C2C',
          700: '#7C6921',
          800: '#504616',
          900: '#24230B',
        },
        'marble': {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#E8E8E8',
          400: '#D9D9D9',
          500: '#BFBFBF',
          600: '#8C8C8C',
          700: '#595959',
          800: '#262626',
          900: '#000000',
        },
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'marble-pattern': "url('/marble-pattern.jpg')",
        'gold-gradient': 'linear-gradient(to right, #D4AF37, #FCC201, #D4AF37)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
} 