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
        navy: {
          DEFAULT: "#102D40",
          dark: "#0A1E2C",
          light: "#1A3E56",
        },
        burgundy: {
          DEFAULT: "#9E151B",
          hover: "#7E1015",
          dark: "#660B0F",
          light: "#B82229",
        },
        gold: {
          DEFAULT: "#B3945C",
          hover: "#9A7D49",
          light: "#CBB284",
          subtle: "rgba(179, 148, 92, 0.25)",
        },
        cream: {
          DEFAULT: "#FAF6EF",
        },
        beige: {
          DEFAULT: "#E9DDCB",
          dark: "#DCCFBA",
        },
        ivory: {
          DEFAULT: "#FAF6EF",
          dark: "#E9DDCB",
        },
        charcoal: "#252B30",
        whatsapp: {
          DEFAULT: "#18864B",
          hover: "#136e3d",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
