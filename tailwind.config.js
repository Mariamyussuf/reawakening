/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Sage & Stone palette
                gold: {
                    DEFAULT: '#D4923A',
                    light: '#ECC07A',
                    dark: '#B87A2A',
                },
                deep: {
                    DEFAULT: '#1A2E1A',
                    2: '#223322',
                    dark: '#162816',
                },
                mid: '#4A6741',
                cream: {
                    DEFAULT: '#F5F0E8',
                    muted: 'rgba(245,240,232,0.55)',
                },
                'warm-white': '#FBF8F2',
                rule: 'rgba(212,146,58,0.22)',
                // Legacy brand colors (keep for compatibility)
                brand: {
                    50:  '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                accent: {
                    50:  '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                },
                neutral: {
                    50:  '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                },
            },
            fontFamily: {
                display: ['Cormorant Garamond', 'Georgia', 'serif'],
                body: ['Jost', 'system-ui', 'sans-serif'],
                sans: ['Jost', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'subtle': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
                'card': '0 2px 4px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.06)',
                'elevated': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
                'lift': '0 8px 25px -5px rgba(26,46,26,0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-down': 'fadeDown 0.7s ease forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
