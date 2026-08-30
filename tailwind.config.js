/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-dark": "#1d4ed8",
        "ink": "#1e293b",
        "muted": "#64748b",
        "surface": "#f8fafc",
        "border": "#e2e8f0"
      }
    },
  },
  plugins: [],
}

