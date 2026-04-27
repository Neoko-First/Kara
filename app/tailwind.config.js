/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kara: {
          primary: "#7C3AED",
          primaryHover: "#6D28D9",
          accent: "#A78BFA",
          accentSoft: "#C4B5FD",
          bg: "#0A0A0F",
          surface: "#111118",
          surface2: "#16161F",
          border: "#1E1E2E",
          borderStrong: "#2A2A3D",
          danger: "#EF4444",
          textDark: "#F1F0FF",
          muted: "#9594B5",
          faint: "#5C5B78",
        },
      },
      fontFamily: {
        display: ["SpaceGrotesk_700Bold"],
        body: ["Inter_400Regular"],
        bodyMedium: ["Inter_500Medium"],
        bodySemiBold: ["Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
};
