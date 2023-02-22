/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        gridTemplateColumns: {
          '20': 'repeat(20, minmax(0, 1fr))',
        }
      }
    },
    plugins: [],
  }