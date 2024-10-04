import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },

        slate: generateScale("slate"),
        cyan: generateScale("cyan"),
        blue: generateScale("blue"),

        "warning-primary": "var(--warning-primary)",
        "warning-secondary": "var(--warning-secondary)",
        "warning-subtle": "var(--warning-subtle)",
        "danger-text": "var(--danger-text)",
        "danger-bg": "var(--danger-bg)",
        "inverse-1": "var(--inverse-1)",
        "inverse-3": "var(--inverse-3)",
        "shadow-viewer": "var(--shadow-viewer)",
        "shadow-floating-element": "var(--shadow-floating-element)",
        "background-app": "var(--background-app)",
        "shadow-subdued": "var(--shadow-subdued)",
        "icon-subdued": "var(--icon-subdued)",
        "icon-neutral": "var(--icon-neutral)",
        "icon-focus": "var(--icon-focus)",
        "surface-subdued": "var(--surface-subdued)",
        "surface-neutral": "var(--surface-neutral)",
        "surface-focus": "var(--surface-focus)",
        home: "var(--home)",
        contrast: "var(--contrast)",
        "txt-subdued": "var(--txt-subdued)",
        "txt-neutral": "var(--txt-neutral)",
        "txt-focus": "var(--txt-focus)",
        "txt-title": "var(--txt-title)",
        "border-neutral": "var(--border-neutral)",
        "border-focus": "var(--border-focus)",
        "btn-txt-subdued": "var(--btn-txt-subdued)",
        "btn-txt-primary-neutral": "var(--btn-txt-primary-neutral)",
        "btn-txt-primary-focus": "var(--btn-txt-primary-focus)",
        "btn-txt-secondary-neutral": "var(--btn-txt-secondary-neutral)",
        "btn-txt-secondary-focus": "var(--btn-txt-secondary-focus)",
        "btn-txt-tertiary-neutral": "var(--btn-txt-tertiary-neutral)",
        "btn-txt-tertiary-focus": "var(--btn-txt-tertiary-focus)",
        "btn-border-primary-subdued": "var(--btn-border-primary-subdued)",
        "btn-border-primary-neutral": "var(--btn-border-primary-neutral)",
        "btn-border-primary-focus": "var(--btn-border-primary-focus)",
        "btn-surface-primary-subdued": "var(--btn-surface-primary-subdued)",
        "btn-surface-primary-neutral": "var(--btn-surface-primary-neutral)",
        "btn-surface-primary-focus": "var(--btn-surface-primary-focus)",
        "btn-surface-secondary-subdued": "var(--btn-surface-secondary-subdued)",
        "btn-surface-secondary-neutral": "var(--btn-surface-secondary-neutral)",
        "btn-surface-secondary-focus": "var(--btn-surface-secondary-focus)",

        error: "#AF372E",
        // success: "#17251B",
        "space-green": "rgba(36, 131, 123, 0.15)",
        "space-cadet": "#1D3149",
      },
      // fontSize: {
      //   "2xs": ["8px", "10px"],
      //   xs: ["10px", "14px"],
      //   sm: ["12px", "16px"],
      //   base: ["14px", "20px"],
      //   lg: ["16px", "24px"],
      //   xl: ["18px", "28px"],
      //   "2xl": ["20px", "32px"],
      //   "3xl": ["24px", "36px"],
      //   "4xl": ["28px", "40px"],
      //   "5xl": ["36px", "44px"],
      //   "6xl": ["48px", "52px"],
      // },
      lineHeight: {
        2: "0.625rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

function generateScale(name: string) {
  let scale = Array.from({ length: 12 }, (_, i) => {
    let id = i + 1;
    return [
      [id, `var(--${name}-${id})`],
      [`a${id}`, `var(--${name}-a${id})`],
    ];
  }).flat();

  return Object.fromEntries(scale);
}
