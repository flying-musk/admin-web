module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "primary": {
          "50": "#8e9cf6",
          "100": "#8492ec",
          "200": "#7a88e2",
          "300": "#707ed8",
          "400": "#6674ce",
          "500": "#5c6ac4",
          "600": "#5260ba",
          "700": "#4856b0",
          "800": "#3e4ca6",
          "900": "#34429c"
        }
      },
    },
  },
  plugins: [],
}
