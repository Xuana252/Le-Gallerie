
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        AppName: "AppName",
        AppLogo: "AppLogo",
      },
      colors: {
        primary: "rgba(var(--primary))",
        secondary: {
          1: "rgba(var(--secondary))",
          2: "rgba(var(--secondary-variant-1))",
        },
        accent: "rgba(var(--accent))",
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-in-out ",
        slideUp: 'slideUp 0.7s ease-in-out'
      },
      keyframes: {
        slideUp: {
          from: {
            transform: "translateY(30px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0px)",
            opacity: "1",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
    },
  },
};
export default config;
