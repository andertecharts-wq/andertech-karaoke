/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgMain: '#0a0a12',
                bgSecondary: '#13131f',
                bgCard: '#1c1c2e',
                primary: {
                    DEFAULT: '#8b5cf6',
                    glow: 'rgba(139, 92, 246, 0.5)',
                },
                secondary: {
                    DEFAULT: '#d946ef',
                    glow: 'rgba(217, 70, 239, 0.5)',
                },
                accent: '#06b6d4'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
