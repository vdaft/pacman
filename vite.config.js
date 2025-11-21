import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'pe9015.schuelerprojekte.online',
                changeOrigin: true,
                secure: true,
            }
        },
        host: true,
        allowedOrigins: ['http://localhost', 'daft', "pe9015.schuelerprojekte.online"],
        allowedHosts: ['http://localhost', 'daft', "pe9015.schuelerprojekte.online"]
    }
});
