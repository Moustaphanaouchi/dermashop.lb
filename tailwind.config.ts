import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FFF7FA",
          100: "#FCE4EC",
          200: "#F9C4D3",
          300: "#F39EB6"
        },
        maroon: {
          700: "#8A0000",
          800: "#800000",
          900: "#5B0000"
        }
      },
      boxShadow: {
        luxe: "0 20px 60px rgba(0,0,0,0.10)",
        luxeSoft: "0 10px 30px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;

