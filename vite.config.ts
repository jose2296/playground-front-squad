import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: './src/assets',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
            '@modules': path.resolve(__dirname, './src/modules/')
        }
    },
    plugins: [react()],
});
