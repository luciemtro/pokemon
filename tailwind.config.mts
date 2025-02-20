import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        goldman: ["Goldman", "sans-serif"],
      },
      backgroundImage: {
        "radial-gradient":
          "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.8) 30%)",
        "radial-gradient-pokemon":
          "radial-gradient(circle, transparent 40%, rgba(3, 0, 10, 0.716), rgba(3, 0, 9, 0.9) 80%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
