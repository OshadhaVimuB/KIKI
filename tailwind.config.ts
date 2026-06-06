import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#fcf9f8",
        foreground: "#1c1b1b",
        "on-background": "#1c1b1b",
        primary: {
          DEFAULT: "#2a1059",
          foreground: "#ffffff",
          container: "#402970",
          "on-container": "#ac94e2",
          fixed: "#eaddff",
          "on-fixed": "#230653",
          "fixed-dim": "#d1bcff",
          "on-fixed-variant": "#503981"
        },
        secondary: {
          DEFAULT: "#6c5e00",
          foreground: "#ffffff",
          container: "#fee016",
          "on-container": "#716200",
          fixed: "#ffe33b",
          "on-fixed": "#211b00",
          "fixed-dim": "#e2c600",
          "on-fixed-variant": "#524700"
        },
        tertiary: {
          DEFAULT: "#2c0b5d",
          foreground: "#ffffff",
          container: "#432673",
          "on-container": "#af91e5",
          fixed: "#ebdcff",
          "on-fixed": "#260257",
          "fixed-dim": "#d4bbff",
          "on-fixed-variant": "#533784"
        },
        surface: {
          DEFAULT: "#fcf9f8",
          bright: "#fcf9f8",
          dim: "#dcd9d9",
          container: "#f0eded",
          "container-lowest": "#ffffff",
          "container-low": "#f6f3f2",
          "container-high": "#eae7e7",
          "container-highest": "#e5e2e1",
          variant: "#e5e2e1",
          "on-variant": "#494550",
          tint: "#68519a",
          glass: "rgba(252, 249, 248, 0.8)"
        },
        error: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
          container: "#ffdad6",
          "on-container": "#93000a"
        },
        outline: {
          DEFAULT: "#7a7581",
          variant: "#cbc4d1"
        },
        inverse: {
          surface: "#313030",
          "on-surface": "#f3f0ef",
          primary: "#d1bcff"
        },
        gold: "#F8DA08",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px"
      },
      spacing: {
        xl: "80px",
        xs: "4px",
        "margin-mobile": "16px",
        md: "24px",
        sm: "12px",
        base: "8px",
        "margin-desktop": "64px",
        gutter: "24px",
        lg: "48px",
        "container-max": "1280px"
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        "label-md": ["var(--font-jakarta)", "sans-serif"],
        "body-lg": ["var(--font-jakarta)", "sans-serif"],
        "headline-lg": ["var(--font-jakarta)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-jakarta)", "sans-serif"],
        "label-sm": ["var(--font-jakarta)", "sans-serif"],
        "headline-sm": ["var(--font-jakarta)", "sans-serif"],
        "body-md": ["var(--font-jakarta)", "sans-serif"],
        "body-sm": ["var(--font-jakarta)", "sans-serif"],
        "headline-md": ["var(--font-jakarta)", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.08em", fontWeight: "700" }],
        "headline-sm": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "headline-md": ["28px", { lineHeight: "1.3", fontWeight: "600" }]
      },
      boxShadow: {
        soft: "0 20px 80px rgba(55, 75, 95, 0.14)",
        glow: "0 18px 60px rgba(52, 167, 152, 0.2)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.1)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite"
      }
    }
  },
  plugins: [animate]
};

export default config;

