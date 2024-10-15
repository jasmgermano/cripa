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
        "custom-pink": "#EE9DC3",
        "custom-green": "#AACDA9",
        "custom-beige": "#F2ECDF",
        "custom-gray": "#4F4F46",
      },
      boxShadow: {
        "custom": "0px 3px 3px 0px #4F4F46",
      },
    },
  },
  plugins: [],
};
export default config;
