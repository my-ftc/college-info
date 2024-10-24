import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      latoLight: ["LatoLight", "sans-serif"],
      latoBold: ["LatoBold", "sans-serif"],
      latoSemiBold: ["LatoSemiBold", "sans-serif"],
      latoRegular: ["LatoRegular", "sans-serif"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        xs: "180px",
      },
    },
  },
  plugins: [],
};
export default config;
