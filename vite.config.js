import { defineConfig } from 'vite';

export default defineConfig({
    port: 5173,
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        host: true,
        allowedOrigins: ['localhost', 'pe9015.schuelerprojekte.online'],
        allowedHosts: ['localhost', 'pe9015.schuelerprojekte.online']
    }
});
