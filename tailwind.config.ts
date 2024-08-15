import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(input|popover).js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: { 
        AppName: 'AppName',
        AppLogo: 'AppLogo'
      },
      colors: {
        primary: 'rgba(var(--primary))',
        secondary: {
          1: 'rgba(var(--secondary))',
          2: 'rgba(var(--secondary-variant-1))',
        },
        accent: 'rgba(var(--accent))',
      },
    },
    fontFamily: {
      AppLogo: 'AppLogo'
    }
  },
  plugins: [nextui()],
};
export default config;
