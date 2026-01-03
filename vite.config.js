import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // TAMBAHKAN BARIS INI AGAR VITE MENGIZINKAN CORS DARI API PUBLIK
    cors: true,
    proxy: {
      // Opsional: Proxy langsung dari Vite ke CoinGecko
      '/api-coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-coingecko/, ''),
      },
    },
  },
});