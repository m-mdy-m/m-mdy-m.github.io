/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', '*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#0d1117',
          green: '#00d97a',
          yellow: '#ffd93d',
          gray: '#21262d',
          white: '#f0f6fc',
          overlay: 'rgba(0, 0, 0, 0.75)',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        typing: 'typing 1.5s steps(30, end)',
        'cursor-blink': 'cursor-blink 1.5s step-end infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-in-slow': 'fade-in 1s ease-in-out',
        scanline: 'scanline 10s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'cursor-blink': {
          '0%, 100%': { borderRightColor: 'transparent' },
          '50%': { borderRightColor: 'currentColor' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'crt-overlay':
          'linear-gradient(transparent 0%, rgba(32, 128, 32, 0.2) 2%, rgba(32, 128, 32, 0.05) 3%, rgba(32, 128, 32, 0.05) 3%, transparent 4%)',
      },
    },
  },
  plugins: [],
};
