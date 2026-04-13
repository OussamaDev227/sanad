/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          400: '#378ADD',
          600: '#185FA5',
          800: '#0C447C',
          900: '#042C53',
        },
        accent: {
          50: '#FAEEDA',
          100: '#FAC775',
          400: '#EF9F27',
          600: '#854F0B',
          800: '#633806',
        },
        teal: {
          50: '#E1F5EE',
          400: '#1D9E75',
          600: '#0F6E56',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
        latin: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
    },
  },
  plugins: [],
}
