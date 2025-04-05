
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
        fadeIn: "fadeIn 0.5s ease-in-out ",
        slideUp: 'slideUp 0.5s ease-in-out',
        slideRight: 'slideRight 0.7s ease-in-out',
        slideLeft: 'slideLeft 0.7s ease-in-out',
        highlight: 'highlighted 2s ease-in-out',
      },
      keyframes: {
        highlighted: {
          "20%": {
            background:  "rgba(var(--primary),0.5)",
          },
          "100%": {
            background:  "transparent",
          },
        },
        slideRight: {
          from: {
            transform: "translateX(-30px)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0px)",
            opacity: "1",
          },
        },
        slideLeft: {
          from: {
            transform: "translateX(30px)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0px)",
            opacity: "1",
          },
        },
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
