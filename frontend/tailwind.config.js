/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#07111f",
        mist: "#d7e5f5",
        aqua: "#6ee7f9",
        lime: "#c7f36b",
        coral: "#ff8a65",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(12, 20, 35, 0.45)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(110,231,249,0.22), transparent 28%), radial-gradient(circle at top right, rgba(199,243,107,0.18), transparent 25%), linear-gradient(135deg, rgba(8,15,27,1) 0%, rgba(9,18,33,1) 40%, rgba(4,10,20,1) 100%)",
      },
    },
  },
  plugins: [],
};

