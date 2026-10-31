/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#141414',
        foreground: '#e6e6e6',
        card: {
          DEFAULT: '#1c1c1c',
          foreground: '#e6e6e6',
        },
        popover: {
          DEFAULT: '#1c1c1c',
          foreground: '#e6e6e6',
        },
        primary: {
          DEFAULT: '#e6e6e6',
          foreground: '#141414',
        },
        secondary: {
          DEFAULT: '#1c1c1c',
          foreground: '#e6e6e6',
        },
        muted: {
          DEFAULT: '#1c1c1c',
          foreground: '#8d8d8d',
        },
        accent: {
          DEFAULT: '#2a2a2a',
          foreground: '#e6e6e6',
        },
        border: '#434343',
        input: '#434343',
        ring: '#8d8d8d',
      },
      fontFamily: {
        ui: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        prose: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        title: ['"lh-cmu"', 'Georgia', 'serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['12.5px', { lineHeight: '1.4' }],
        base: ['14px', { lineHeight: '1.45' }],
        lg: ['16px', { lineHeight: '1.45' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['25px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.25' }],
      },
      spacing: {
        15: '3.75rem', // 60px TopBar height
      },
    },
  },
  plugins: [],
}
