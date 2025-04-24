/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          dark: 'hsl(var(--primary-dark))',
          light: 'hsl(var(--primary-light))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(217, 91%, 60%)',
          foreground: 'hsl(217, 91%, 98%)',
        },
        accent: {
          DEFAULT: 'hsl(151, 85%, 40%)',
          foreground: 'hsl(151, 85%, 98%)',
        },
        background: 'hsl(240, 10%, 4%)',
        foreground: 'hsl(240, 10%, 90%)',
        card: 'hsl(240, 6%, 10%)',
        'card-foreground': 'hsl(240, 6%, 90%)',
        success: 'hsl(160, 84%, 39%)',
        warning: 'hsl(35, 92%, 51%)',
        error: 'hsl(0, 84%, 60%)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};