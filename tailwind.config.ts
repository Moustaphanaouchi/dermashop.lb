import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: '#FCE4EC',
        maroon: '#800000',
      },
      boxShadow: {
        luxe: '0 20px 60px -15px rgba(128,0,0,0.25)',
      },
    },
  },
  plugins: [],
};

export default config;