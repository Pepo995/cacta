import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "gray/900": "var(--gray900)",
        "gray/800": "var(--gray800)",
        "gray/700": "var(--gray700)",
        "gray/600": "var(--gray600)",
        "gray/500": "var(--gray500)",
        "gray/400": "var(--gray400)",
        "gray/300": "var(--gray300)",
        "gray/200": "var(--gray200)",
        "gray/100": "var(--gray100)",

        gray_32: "var(--gray_32)",
        gray_24: "var(--gray_24)",
        gray_16: "var(--gray_16)",
        gray_8: "var(--gray_8)",

        white_32: "var(--white_32)",
        white_24: "var(--white_24)",
        white_16: "var(--white_16)",
        white_8: "var(--white_8)",

        secondary: "var(--secondary)",
        "secondary/lighter": "var(--secondaryLighter)",
        "secondary/light": "var(--secondaryLight)",
        "secondary/dark": "var(--secondaryDark)",
        "secondary/darker": "var(--secondaryDarker)",

        success: "var(--success)",
        "success/lighter": "var(--successLighter)",
        "success/light": "var(--successLight)",
        "success/dark": "var(--successDark)",
        "success/darker": "var(--successDarker)",

        warning: "var(--warning)",
        "warning/lighter": "var(--warningLighter)",
        "warning/light": "var(--warningLight)",
        "warning/dark": "var(--warningDark)",
        "warning/darker": "var(--warningDarker)",

        error: "var(--error)",
        "error/lighter": "var(--errorLighter)",
        "error/light": "var(--errorLight)",
        "error/dark": "var(--errorDark)",
        "error/darker": "var(--errorDarker)",

        info: "var(--info)",
        info_8: "var(--info_8)",
        info_16: "var(--info_16)",
        "info/dark": "var(--infoDark)",

        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        highlights: "var(--highlights)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--tertiary-foreground)",
        },
        disabled: {
          DEFAULT: "var(--disabled)",
          foreground: "var(--disabled-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        "alert-success": {
          DEFAULT: "var(--alert-success)",
          foreground: "var(--alert-success-foreground)",
        },
        "alert-error": {
          DEFAULT: "var(--alert-error)",
          foreground: "var(--alert-error-foreground)",
        },
        "alert-warning": {
          DEFAULT: "var(--alert-warning)",
          foreground: "var(--alert-warning-foreground)",
        },
        cancel: {
          DEFAULT: "var(--cancel)",
          foreground: "var(--cancel-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        xxl: "16px",
        xl: "12px",
        lg: "10px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        Inter: ["Poppins", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        default:
          "0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)",
      },
    },
    fontFamily: {
      primary: ["Poppins", "sans-serif"],
      secondary: ["Public Sans", "sans-serif"],
    },
    backgroundImage: {
      "gradient-green-to-red":
        "linear-gradient(90deg, #22c55e 0%, #ffcd29 50%, #ff5630 100%)",
      "gradient-secondary": "linear-gradient(135deg, #C684FF 0%, #8E33FF 100%)",
      "gradient-success": "linear-gradient(135deg, #22C55E 0%, #118D57 100%)",
      "gradient-error": "linear-gradient(135deg, #FFAC82 0%, #FF5630 100%)",
      "authorization-banner":
        "linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%), url('/images/auth-banner.webp')",
    },
  },
  plugins: [require("tailwindcss-animate")],
  experimental: {
    classRegex: [["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]],
  },
};
