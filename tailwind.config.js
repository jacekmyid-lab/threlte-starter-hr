/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {
        colors: {
          'cad-primary': '#2563eb',
          'cad-accent': '#06b6d4',
          'cad-hover': '#fbbf24',
          'cad-selected': '#ef4444',
          'cad-bg-dark': '#0f172a',
          'cad-bg-panel': '#1e293b',
          'cad-text': '#f1f5f9',
          'cad-border': '#334155',
        }
      },
    },
    plugins: [],
  }