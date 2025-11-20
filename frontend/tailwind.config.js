module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-100': '#f5f5f5',
        'dark-200': '#e0e0e0',
        'dark-300': '#bdbdbd',
        'dark-400': '#9e9e9e',
        'dark-500': '#757575',
        'dark-600': '#616161',
        'dark-700': '#424242',
        'dark-800': '#212121',
        'green-500': '#4caf50',
        'green-600': '#43a047',
        'green-700': '#388e3c',
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
