import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hanseatic theme colors
        "hanse-wood": "#8B4513",
        "hanse-wood-light": "#A0522D",
        "hanse-parchment": "#F5E6C8",
        "hanse-parchment-dark": "#E8D4A8",
        "hanse-gold": "#DAA520",
        "hanse-gold-dark": "#B8860B",
        "hanse-sea": "#1E3A5F",
        "hanse-sea-light": "#2E5A8F",
        "hanse-ink": "#1A1A2E",
      },
      fontFamily: {
        pixel: ["monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
