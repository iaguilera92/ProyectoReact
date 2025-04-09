import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  assetsInclude: ['**/*.xlsx'],
  plugins: [
    react(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 75
      },
      pngquant: {
        quality: [0.7, 0.9],
        speed: 3
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      },
      webp: {
        quality: 75
      },
      avif: {
        quality: 50
      }
    })
  ],
  server: {
    mimeTypes: {
      '.jsx': 'application/javascript'
    }
  }
});
