import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      animation: {
        char: "char 1250ms infinite",
        hex: "hex 1250ms infinite",
      },
      colors: {
        primary: {
          // 100: "",
          // 200: "",
          300: "#6b7280",
          400: "#3a4352",
          500: "#293340",
          600: "#253043",
          700: "#2a3441",
          800: "#1f2937",
          900: "#192231",
        },
      },
      keyframes: {
        char: {
          ["0%, 49%"]: {
            boxShadow: "inset 0 0 0 20px var(--animate-color)",
          },
          ["50%,100%"]: {
            boxShadow: "none",
          },
        },
        hex: {
          ["0%, 49%"]: {
            boxShadow: "inset 0 -4px 0 -2px var(--animate-color)",
          },
          ["50%,100%"]: {
            boxShadow: "none",
          },
        },
      },
      screens: {
        "2xl": "1320px",
      },
    },
    fontFamily: {
      roboto: ["Roboto"],
      source: ["Source Code Pro"],
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          MsOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
