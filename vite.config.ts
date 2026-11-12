import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages yayın yolu: https://<kullanici>.github.io/bizim-takvim/
export default defineConfig({
  base: '/bizim-takvim/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});
