// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Dark mode specific colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
        }
      },
      backgroundColor: {
        'docs-light': '#ffffff',
        'docs-dark': '#0f172a',
        'surface-light': '#f8fafc',
        'surface-dark': '#1e293b',
      },
      textColor: {
        'docs-light': '#1e293b',
        'docs-dark': '#f1f5f9',
        'docs-light-secondary': '#64748b',
        'docs-dark-secondary': '#94a3b8',
      }
    },
  },
  plugins: [],
};
