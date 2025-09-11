import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import { writeFileSync } from 'fs';

export default defineConfig({
  assetsInclude: ['**/*.xlsx'],
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.7, 0.9], speed: 3 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      webp: { quality: 75 },
      avif: { quality: 50 },
    }),
    {
      name: 'generate-version-json',
      writeBundle() {
        const version = Date.now().toString();
        writeFileSync('public/version.json', JSON.stringify({ version }), 'utf-8');
        console.log(`✅ version.json generado: ${version}`);
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    mimeTypes: { '.jsx': 'application/javascript' },
    allowedHosts: ['c4d2e41af764.ngrok-free.app'],
  },
});
