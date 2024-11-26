import tailwindcssTypography from '@tailwindcss/typography';
import daisyui from 'daisyui';

export const themes = [
    'dracula',
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
];

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
        themes
    },
};
export default a;
