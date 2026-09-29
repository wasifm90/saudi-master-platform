/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public_html/**/*.{html,js}",
    "./frontend/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        "desert-ivory": "#FAF8F5",
        "soft-sand": "#F3ECE0",
        "content-offwhite": "#FFFFFF",
        "card-surface": "#FFFFFF",
        "divider-color": "#E8DFD1",
        "charcoal": "#18181B",
        "muted-brown": "#57534E",
        "primary-gold": "#D4AF37",
        "gold-bright": "#F5C842",
        "secondary-earth": "#C86D2C",
        "ulma-orange": "#FF8A00",
        "footer-dark": "#18181B"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        arabic: ["'Cairo'", "sans-serif"]
      }
    },
  },
  plugins: [],
}
