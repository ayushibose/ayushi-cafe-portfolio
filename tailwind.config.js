import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff2d95',
          magenta: '#d600ff',
          purple: '#9d4edd',
          blue: '#3a86ff',
          cyan: '#00f0ff',
          green: '#39ff14',
        },
        night: {
          900: '#05010f',
          850: '#0a0420',
          800: '#0e0830',
          700: '#160d44',
          600: '#1d1466',
          500: '#251a8a',
        },
        ink: {
          900: '#0a0612',
          800: '#120a22',
          700: '#1c1133',
          600: '#281a4a',
        },
        cream: {
          100: '#f0e9ff',
          200: '#c9b8ff',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        sans: ['"Rajdhani"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-pink': '0 0 20px -2px rgba(255, 45, 149, 0.6)',
        'glow-cyan': '0 0 20px -2px rgba(0, 240, 255, 0.6)',
        'glow-purple': '0 0 20px -2px rgba(157, 78, 221, 0.6)',
      },
      animation: {
        'flicker': 'flicker 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
