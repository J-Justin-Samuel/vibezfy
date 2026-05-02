/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vibe: {
          bg: "#0a0a0f",
          surface: "#111118",
          card: "#16161f",
          border: "#1e1e2e",
          accent: "#6c63ff",
          accentHover: "#7c73ff",
          green: "#1db954",
          text: "#e8e8f0",
          muted: "#6b6b80",
        },
      },
      fontFamily: {
        display: ['"Clash Display"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        wave: "wave 1.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          from: { boxShadow: "0 0 10px #6c63ff40" },
          to: { boxShadow: "0 0 30px #6c63ff80, 0 0 60px #6c63ff30" },
        },
      },
    },
  },
  plugins: [],
};
