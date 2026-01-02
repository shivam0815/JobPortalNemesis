/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
   extend: {
  colors: {
    navy: {
      950: "#040B1A",
      900: "#061433",
      850: "#071A3F",
      800: "#0A2558",
      700: "#0E3375",
      600: "#14449B",
    },
    accent: {
      500: "#2B7BFF",
      600: "#1D67E0",
    },
  },
  boxShadow: {
    soft: "0 12px 30px rgba(0,0,0,0.22)",
    card: "0 10px 24px rgba(2, 12, 27, 0.30)",
  },
    },
  },
  plugins: [],
};
