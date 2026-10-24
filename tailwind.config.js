/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--page)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        brand: 'var(--brand)',
        onbrand: 'var(--onbrand)',
        danger: 'var(--danger)',
        ondanger: 'var(--ondanger)',
        ok: 'var(--ok)',
        soft: 'var(--soft)',
        warnbg: 'var(--warnbg)',
        warnink: 'var(--warnink)',
      },
    },
  },
  plugins: [],
};
