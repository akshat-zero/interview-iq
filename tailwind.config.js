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
        // Warm Desert Editorial core palette
        obsidian: '#0C0F14',
        'burnt-umber': '#A55534',
        terracotta: '#C68C6E',
        oxblood: '#3A1D19',
        paper: '#EEE9E3',
        'warm-ivory': '#F5F1EC',

        // Semantic bindings
        background: '#0C0F14',
        foreground: '#F5F1EC',
        card: {
          DEFAULT: '#12161F',
          foreground: '#F5F1EC',
          paper: '#EEE9E3',
          'paper-foreground': '#0C0F14',
        },
        popover: {
          DEFAULT: '#12161F',
          foreground: '#F5F1EC',
        },
        primary: {
          DEFAULT: '#A55534',
          foreground: '#F5F1EC',
        },
        secondary: {
          DEFAULT: '#3A1D19',
          foreground: '#F5F1EC',
        },
        muted: {
          DEFAULT: '#171B24',
          foreground: '#C68C6E',
        },
        accent: {
          DEFAULT: '#241A18',
          foreground: '#F5F1EC',
        },
        border: '#281E1C',
        input: '#281E1C',
        ring: '#A55534',
      },
      fontFamily: {
        ui: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        prose: ['Inter', '"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        title: ['Archivo', '"Abril Fatface"', '"lh-cmu"', 'Georgia', 'serif'],
        editorial: ['Archivo', '"Abril Fatface"', '"lh-cmu"', 'Georgia', 'serif'],
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
        15: '3.75rem',
      },
    },
  },
  plugins: [],
}
