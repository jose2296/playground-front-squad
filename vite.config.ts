import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: './src/assets',
    resolve: {
        alias: {
            '@modules': path.resolve(__dirname, './src/app/modules/')
        }
    },
    plugins: [react()],
});
