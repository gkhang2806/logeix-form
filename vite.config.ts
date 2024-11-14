// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/logeix-form/',  // Replace with your repository name
  build: {
    lib: {
      entry: resolve(__dirname, 'src/contact-form.tsx'),
      name: 'ContactFormWidget',
      fileName: 'contact-form-widget',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        // Ensure all dependencies are bundled
        inlineDynamicImports: true,
      }
    }
  }
});