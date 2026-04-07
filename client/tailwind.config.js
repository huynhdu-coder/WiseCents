module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        md: "var(--text-md)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
      },
      colors: {
        app: {
          bg: "rgb(var(--bg) / <alpha-value>)",
          sidebar: "rgb(var(--bg-sidebar) / <alpha-value>)",
          surface: "rgb(var(--surface) / <alpha-value>)",
          soft: "rgb(var(--surface-soft) / <alpha-value>)",
          mutedSurface: "rgb(var(--surface-muted) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
          borderSoft: "rgb(var(--border-soft) / <alpha-value>)",
          text: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          primary: "rgb(var(--primary) / <alpha-value>)",
          primaryHover: "rgb(var(--primary-hover) / <alpha-value>)",
          primarySoft: "rgb(var(--primary-soft) / <alpha-value>)",
          success: "rgb(var(--success) / <alpha-value>)",
          danger: "rgb(var(--danger) / <alpha-value>)",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        card: "0 10px 30px rgba(2, 8, 23, 0.06)",
      },
    },
  },
  plugins: [],
};