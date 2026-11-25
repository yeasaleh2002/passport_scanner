import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#14213d", paper: "#f3f6fa", stamp: "#0f766e" },
      keyframes: { sweep: { "0%,100%": { top: "0%" }, "50%": { top: "calc(100% - 3px)" } } },
      animation: { sweep: "sweep 2.2s ease-in-out infinite" },
    },
  },
} satisfies Config;
