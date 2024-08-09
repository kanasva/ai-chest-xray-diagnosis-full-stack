import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(215, 40%, 40%)",
          hovered: "hsl(215, 40%, 33%)",
          pressed: "hsl(215, 40%, 26%)",
        },
        secondary: {
          DEFAULT: "hsl(219, 14%, 39%)",
          hovered: "hsl(220, 14%, 32%)",
          pressed: "hsl(220, 14%, 25%)",
          on: "hsl(219, 14%, 100%)",
        },
        surface: {
          DEFAULT: "hsl(240, 100%, 99%)",
          container: {
            DEFAULT: "hsl(240, 24%, 94%)",
            high: {
              DEFAULT: "hsl(231, 17%, 92%)",
              hovered: "hsl(231, 17%, 85%)",
            },
          },
          on: {
            DEFAULT: "hsl(210, 11%, 11%)",
            var: "hsl(218, 8%, 28%)",
          },
          outline: "hsl(224, 5%, 48%)",
        },
        error: {
          DEFAULT: "hsl(0, 75%, 42%)",
          hovered: "hsl(0, 75%, 35%)",
          pressed: "hsl(0, 75%, 28%)",
          container: {
            DEFAULT: "hsl(6, 100%, 92%)",
            hovered: "hsl(6, 100%, 85%)",
            pressed: "hsl(6, 100%, 78%)",
            on: "hsl(350, 100%, 13%)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-react-aria-components")],
};

export default config;
