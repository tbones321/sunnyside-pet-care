import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'variform-maureen-unecstatically.ngrok-free.dev'
    ]
    ,
    proxy: {
      // Proxy API requests to the backend during development so relative paths work
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  base: '/sunnyside-pet-care'
})