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
                navy: {
                    50:  '#eef1f8',
                    100: '#d5dced',
                    200: '#aab8da',
                    300: '#7a91c1',
                    400: '#5470aa',
                    500: '#3a5491',
                    600: '#2d4278',
                    700: '#1f3060',
                    800: '#162147',
                    900: '#0F1628',
                    950: '#080d18',
                },
                gold: {
                    50:  '#fdf9ed',
                    100: '#faf1d0',
                    200: '#f5e09e',
                    300: '#edca66',
                    400: '#e4b23b',
                    500: '#D4AF37',
                    600: '#b8911f',
                    700: '#956e18',
                    800: '#7a551a',
                    900: '#67451a',
                    950: '#3b240b',
                },
                cream: {
                    50:  '#FDFAF4',
                    100: '#F9F3E3',
                    200: '#F2E6C8',
                    300: '#E8D5A8',
                    400: '#DBC285',
                    500: '#CDAE65',
                },
                ink: {
                    50:  '#f5f1eb',
                    100: '#e8e0d2',
                    200: '#d0c3aa',
                    300: '#b5a07e',
                    400: '#9a8060',
                    500: '#7e6448',
                    600: '#65503a',
                    700: '#4e3d2d',
                    800: '#382b1e',
                    900: '#201910',
                    950: '#120e08',
                },
            },
            fontFamily: {
                display: ['Cormorant Garamond', 'Georgia', 'serif'],
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                serif: ['Cormorant Garamond', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glow-gold': '0 0 30px rgba(212,175,55,0.25)',
                'glow-navy': '0 0 40px rgba(15,22,40,0.4)',
                'card': '0 2px 8px rgba(15,22,40,0.08), 0 0 1px rgba(15,22,40,0.12)',
                'card-hover': '0 8px 32px rgba(15,22,40,0.14), 0 0 1px rgba(15,22,40,0.12)',
                'premium': '0 24px 64px rgba(15,22,40,0.18), 0 0 1px rgba(15,22,40,0.08)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E09E 50%, #D4AF37 100%)',
                'navy-gradient': 'linear-gradient(135deg, #0F1628 0%, #1f3060 100%)',
                'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
            animation: {
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
            },
        },
    },
    plugins: [],
};
