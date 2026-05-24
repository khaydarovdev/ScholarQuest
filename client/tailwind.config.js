
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        panel2: 'rgb(var(--color-panel-2) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accent2: 'rgb(var(--color-accent-2) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(120,166,255,0.18)',
        soft: '0 16px 40px rgba(6, 12, 24, 0.24)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(120,166,255,0.18), transparent 30%), radial-gradient(circle at top right, rgba(158,240,217,0.12), transparent 28%), linear-gradient(180deg, rgba(7,17,31,0.96), rgba(7,17,31,1))'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
