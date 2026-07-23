/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial blue-and-cream identity (not an all-dark SaaS palette).
        navy: "#0C0C0C",
        surface: "#1A1A1A",
        cream: "#F4EFE5",
        paper: "#FFFDF7",
        blue: "#173DE5",
        "deep-blue": "#0D28B8",
        // Lighter tint for flowing text ON NAVY/SURFACE — plain "blue" fails
        // WCAG AA (4.5:1) for normal-size text there; this passes (5.7:1).
        // For text ON CREAM/PAPER, use plain "blue" instead (6.5:1) — "blue-light" fails there (3:1).
        "blue-light": "#6581FF",
        signal: "#C8FF22",
        // "muted" is for secondary text ON DARK (navy/surface/blue) — 5.7:1 on navy.
        // Fails on cream/paper — use "muted-ink" there instead (6.5:1 on cream).
        muted: "#8A8A8A",
        "muted-ink": "#555555",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "ui-monospace", "monospace"],
        // Handwritten-style, used only for annotations/arrows/notes and the
        // hero signature wordmark — never for body copy.
        hand: ["Caveat", "cursive"],
        note: ["Kalam", "cursive"],
      },
    },
  },
  plugins: [],
};
