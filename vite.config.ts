import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          utils: ['date-fns', 'zod', 'otplib', 'qrcode']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase',
      'lucide-react',
      'date-fns',
      'otplib',
      'qrcode'
    ]
  }
});