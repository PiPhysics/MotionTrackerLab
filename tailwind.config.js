module.exports = {
    content: ["./labweb/frontend/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          'primary': '#26609A',
          'secondary': '#123253',
        },
        fontFamily: {
          'logofont': ['Poppins', 'sans-serif'],
          'primaryfont': ['Inter', 'sans-serif'],
        },
        screens: {
          'tablet': '768px',
          'laptop': '1300px',
          'desktop': '1440px'
        },
      },
    },
    plugins: [],
  };