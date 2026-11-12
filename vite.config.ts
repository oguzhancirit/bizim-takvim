import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Yayın: Firebase Hosting kök dizini (https://bizim-takvim-48b62.web.app/)
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});
