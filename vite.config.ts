import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://p33279i881.vicp.fun',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, '/v1'),
      },
    },
  },
});
