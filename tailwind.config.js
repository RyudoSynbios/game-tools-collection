import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
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
