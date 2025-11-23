/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🟢 WiseCents Color Palette
        wisegreen: "#1B4D3E",
        wiselight: "#A5B5AA",
        wiseyellow: "#C9A227",
        wisewhite: "#F8F9FA",
        wisetext: "#222222",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // optional plugin for better form UI
  ],
}

