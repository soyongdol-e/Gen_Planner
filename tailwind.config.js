/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      fontSize: {
        // Display
        'display-lg': ['60px', { lineHeight: '150%', letterSpacing: '1px', fontWeight: '700' }],
        'display-md': ['44px', { lineHeight: '150%', letterSpacing: '1px', fontWeight: '700' }],
        'display-sm': ['36px', { lineHeight: '150%', letterSpacing: '1px', fontWeight: '700' }],
        
        // Heading
        'heading-xl': ['40px', { lineHeight: '150%', letterSpacing: '1px', fontWeight: '700' }],
        'heading-lg': ['32px', { lineHeight: '150%', letterSpacing: '1px', fontWeight: '700' }],
        'heading-md': ['24px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'heading-sm': ['19px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'heading-xs': ['17px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'heading-xxs': ['15px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        
        // Body
        'body-lg': ['19px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'body-lg-bold': ['19px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'body-md': ['17px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }], // 기본
        'body-md-bold': ['17px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'body-sm': ['15px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm-bold': ['15px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'body-xs': ['13px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'body-xs-bold': ['13px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        
        // Label (for components)
        'label-lg': ['19px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'label-md': ['17px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'label-sm': ['15px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'label-xs': ['13px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
