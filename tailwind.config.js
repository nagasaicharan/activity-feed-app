/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./ui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF9E8',
          100: '#FFF1C2',
          200: '#FFE799',
          300: '#FFDA66',
          400: '#FACC33',
          500: '#E6B800',
          600: '#CCA300',
          700: '#A88200',
          800: '#7A5E00',
          900: '#4F3D00',
          DEFAULT: '#CCA300',
        },
        // Status colors
        statusPending: {
          bg: '#FEF3C7',
          text: '#92400E',
          border: '#FDE68A',
        },
        statusInProgress: {
          bg: '#DBEAFE',
          text: '#1E40AF',
          border: '#BFDBFE',
        },
        statusCompleted: {
          bg: '#D1FAE5',
          text: '#065F46',
          border: '#A7F3D0',
        },
        // Sync status
        synced: '#00A651',
        syncPending: '#F59E0B',
        syncError: '#DC2626',
        // Semantic colors
        success: '#00A651',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
}
