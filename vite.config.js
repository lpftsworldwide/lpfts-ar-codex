import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  },
  publicDir: 'public'
});

