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
        // Dark theme - Graphite & Oxblood core palette
        'obsidian-plum': '#241910',
        'smoked-plum': '#302329',
        'dark-merlot': '#3B2931',
        'deep-plum': '#44323A',
        oxblood: '#482832',
        'burgundy-wine': '#754653',
        'antique-rose': '#B18A91',
        'soft-rose': '#C6A0A7',
        'rose-blush': '#C69BA5',
        'rose-ash': '#E9DFDF',
        'porcelain-white': '#F4EDEF',
        'dusty-rose-grey': '#D5BFC3',
        'muted-mauve-grey': '#B9A5AA',
        'oxblood-border': '#513A42',

        // Semantic bindings
        background: '#241910',
        foreground: '#E9DFDF',
        card: {
          DEFAULT: '#302329',
          foreground: '#E9DFDF',
          secondary: '#3B2931',
          elevated: '#44323A',
        },
        popover: {
          DEFAULT: '#44323A',
          foreground: '#E9DFDF',
        },
        primary: {
          DEFAULT: '#754653',
          foreground: '#F4EDEF',
          hover: '#C6A0A7',
        },
        secondary: {
          DEFAULT: '#482832',
          foreground: '#E9DFDF',
        },
        muted: {
          DEFAULT: '#3B2931',
          foreground: '#B9A5AA',
        },
        accent: {
          DEFAULT: '#44323A',
          foreground: '#F4EDEF',
        },
        border: '#513A42',
        input: '#513A42',
        ring: '#754653',
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
