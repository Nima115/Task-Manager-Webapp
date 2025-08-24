
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 20px -10px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};
export default config;
