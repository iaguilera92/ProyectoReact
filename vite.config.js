import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  assetsInclude: ['**/*.xlsx'],
  plugins: [react()],
  server: {
    mimeTypes: {
      '.jsx': 'application/javascript'
    }
  }
});