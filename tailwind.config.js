export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], sans: ['"DM Sans"', 'sans-serif'] },
      colors: {
        soft: 'rgb(var(--c-soft) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        mint: 'rgb(var(--c-mint) / <alpha-value>)',
        berry: 'rgb(var(--c-berry) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
