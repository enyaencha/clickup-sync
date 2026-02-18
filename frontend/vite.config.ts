import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 3001,
    host: true,
    // Proxy is only used when VITE_API_URL is not set (i.e., pure localhost development)
    // When accessing via network IP, the API URL should be configured via .env.development.local
    proxy: process.env.VITE_API_URL ? undefined : {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
