import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: true,
            }
        },
        host: true,
        allowedOrigins: ['http://localhost', 'daft', "pe9015.schuelerprojekte.online"],
    }
});
