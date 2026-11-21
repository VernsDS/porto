import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['gsap', 'lenis'],
          icons: ['lucide-react', 'react-icons/fa', 'react-icons/si'],
        },
      },
    },
  },
})
