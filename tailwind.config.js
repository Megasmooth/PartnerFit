/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                vault: {
                    bg: '#0F0F0F',
                    text: '#FFFFFF',
                    corp: '#00FFFF', // Cyan
                    startup: '#22c55e', // Neon Green (matching Splash)
                    gap: '#ef4444', // Red
                    card: 'rgba(255, 255, 255, 0.05)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scanner': 'scanner 2s linear infinite',
            },
            keyframes: {
                scanner: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            }
        },
    },
    plugins: [],
}
