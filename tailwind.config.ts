import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#071426', // Main Background
          surface: '#0D1D33', // Card or Section Surface Background
        },
        electric: {
          DEFAULT: '#168BFF', // Primary Color
          bright: '#36A3FF',  // Bright Blue Accent
        },
        purple: {
          DEFAULT: '#7457FF', // Subtle Purple Gradient Base
          accent: '#9C5CFF',  // Purple Accent
        },
        charcoal: '#222B38',   // Light Background Text Color
        'soft-gray': '#6E7785', // Description & Subheading Text Color
        'light-bg': '#F5F8FC',  // Light Background Section
        gold: '#D8B45A',       // Premium Accents (limited use)
        borderColor: 'rgba(255,255,255,0.10)' // White 10% Border
      },
      fontFamily: {
        // ইংরেজি লেখার জন্য প্রফেশনাল ফন্ট স্ট্যাক
        sans: ['Inter', 'Manrope', 'sans-serif'],
        // বাংলা লেখার জন্য ইউনিকোড ফন্ট স্ট্যাক (ভাঙা ফন্ট প্রতিরোধ করতে)
        bengali: ['"Noto Sans Bengali"', '"Hind Siliguri"', '"Nirmala UI"', 'Vrinda', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(7, 20, 38, 0.3)',
        'glass': '0 8px 32px 0 rgba(13, 29, 51, 0.37)',
      },
      spacing: {
        // আইফোন বা অন্যান্য নচযুক্ত ডিভাইসের সেফ-এরিয়া সাপোর্টের জন্য স্পেসিং
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
} satisfies Config