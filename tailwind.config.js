import tailwindcssTypography from '@tailwindcss/typography';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
const a = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    plugins: [
        daisyui,
        tailwindcssTypography
    ],
    daisyui: {
        themes: ['dracula'],
    },
};
export default a;
