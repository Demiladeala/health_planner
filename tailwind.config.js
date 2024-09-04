/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
       'lg': '1200px',
      },
      colors:{
       primary:{
        purple:"#8353E2",
        black:"#171A1F",
        blue:"#C8F9FF",
        gray:"#9095A0",
       }
      }
    },
  },
  plugins: [],
}