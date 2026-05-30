import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "var(--font-geist-mono)", "monospace"],
      },
      colors: {
        void: "#020408",
        deep: "#060c14",
        base: "#0a1628",
        raised: "#0f1f38",
        surface: "#162840",
        "surface-hover": "#1e3550",
        accent: {
          DEFAULT: "#3b82f6",
          glow: "#60a5fa",
          dim: "#1d4ed8",
        },
        violet: {
          DEFAULT: "#7c3aed",
          glow: "#8b5cf6",
        },
        success: "#10b981",
        "success-dim": "#065f46",
        warning: "#f59e0b",
        danger: "#ef4444",
        text: {
          primary: "#f0f6ff",
          secondary: "#94a3b8",
          muted: "#475569",
          accent: "#60a5fa",
        },
      },
      borderColor: {
        subtle: "rgba(59, 130, 246, 0.1)",
        default: "rgba(59, 130, 246, 0.2)",
        bright: "rgba(59, 130, 246, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        scan: "scan 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        blink: "blink 1s step-end infinite",
        "stream-in": "streamIn 0.1s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "bounce-subtle": "bounceSub 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glow: {
          from: { boxShadow: "0 0 5px #3b82f6" },
          to: { boxShadow: "0 0 20px #3b82f6, 0 0 40px #7c3aed" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        streamIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSub: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
