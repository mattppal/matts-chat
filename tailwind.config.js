/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'accent-gray': '#f3f4f6',
                border: '#e5e7eb',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}