import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      path: '/hmr/',
      timeout: 120000
    },
    watch: {
      usePolling: true,
      interval: 500,
    },
    cors: {
      origin: '*'
    },
    allowedHosts: ['a0be2283-6f2f-44ff-8910-983aa0a4a8cc-00-20xcgy64l6oxl.kirk.replit.dev'],
  }
});