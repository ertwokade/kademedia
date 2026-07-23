import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// NOT: Anasayfa artık native React (src/pages/Home.jsx) — WebGL hero izole
// /hero.html iframe'inde. Eski `/` → site.html rewrite'ı (dev ve vercel.json'da)
// kaldırıldı; `/` doğrudan SPA'ya düşer.

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      external: [/^api\//],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['bcryptjs', 'jsonwebtoken', 'mongodb', 'nodemailer'],
  },
})
