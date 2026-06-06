/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif SC', 'PingFang SC', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        eink: {
          bg: '#ffffff',
          fg: '#000000',
          gray: '#555555',
          'light-gray': '#999999',
        },
      },
    },
  },
  plugins: [],
};
