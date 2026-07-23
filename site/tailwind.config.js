/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#080D1A",
        surface: "#111827",
        paper: "#F4F1E8",
        blue: "#3157FF",
        // Lighter tint for flowing text on dark backgrounds — #3157FF fails
        // WCAG AA (4.5:1) for normal-size text on navy/surface; this passes.
        "blue-light": "#6581FF",
        signal: "#C9FF3D",
        muted: "#9DA7BC",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
