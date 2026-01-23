/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],

  content: [
    "./pages/**/*.{ts,tsx,jsx}",
    "./components/**/*.{ts,tsx,jsx}",
    "./app/**/*.{ts,tsx,jsx}",
    "./src/**/*.{ts,tsx,jsx}",
  ],

  theme: {
    /* =====================
       BREAKPOINTS
       ===================== */
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },

    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      /* =====================
         COLORS (CSS TOKENS)
         ===================== */
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },

        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },

        success: "var(--success-500)",
        warning: "var(--warning-500)",
        danger: "var(--danger-500)",
       
      },

      /* =====================
         TYPOGRAPHY
         ===================== */
      fontFamily: {
        primary: ["var(--font-primary)"],
      },

      fontSize: {
        h1: "var(--h1)",
        h2: "var(--h2)",
        h3: "var(--h3)",
        h4: "var(--h4)",
        h5: "var(--h5)",
        h6: "var(--h6)",

        lead: "var(--p-lead)",
        p: "var(--p)",
        small: "var(--p-small)",
        tiny: "var(--tiny)",
        p11: "var(--p11)",
        p10: "var(--p10)",
      },

      /* =====================
         RADIUS
         ===================== */
      borderRadius: {
        sm: "var(--control-radius-sm)",
        md: "var(--control-radius-md)",
        lg: "var(--control-radius-lg)",

        toast: "var(--toast-radius)",
        modal: "var(--modal-radius)",
        tab: "var(--tab-radius)",
      },

      /* =====================
         SPACING (TOKENS)
         ===================== */
      spacing: {
        "toast-sm": "var(--toast-sm-p)",
        "toast-md": "var(--toast-md-p)",
        "toast-lg": "var(--toast-lg-p)",

        "modal-sm": "var(--modal-sm-p)",
        "modal-md": "var(--modal-md-p)",
        "modal-lg": "var(--modal-lg-p)",
      },

      /* =====================
         SHADOWS
         ===================== */
      boxShadow: {
        toast: "var(--toast-shadow)",
      },

      /* =====================
         ANIMATIONS
         ===================== */
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        toastIn: {
          "0%": { opacity: "0", transform: "translateY(-8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },

        toastOut: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-6px) scale(0.96)" },
        },

        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },

        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "toast-in": "toastIn 0.25s ease-out",
        "toast-out": "toastOut 0.2s ease-in forwards",

        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        "spin-slow": "spin 3s linear infinite",
        bounce: "bounce 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
