import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        },
        host: true,
        allowedOrigins: ['localhost', 'pe9015.schuelerprojekte.online'],
        allowedHosts: ['localhost', 'pe9015.schuelerprojekte.online']
    }
});
