/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#166534',       // Primary forest green
          deep: '#14532d',       // Deepest green
          primary: '#166534',
          emerald: '#16A34A',    // Secondary vibrant emerald
          lightEmerald: '#22c55e',
          bg: '#F5F8F5',         // Pale grey-green background
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderGreen: '#DCFCE7',
          slate: '#1E293B',
          muted: '#64748B',
          subtle: '#94A3B8',
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'gov-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
