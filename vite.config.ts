import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // If building for GitHub Pages, use the repo name as base
  base: process.env.VITE_BASE || '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8123', // Change to your HA IP for local dev
        changeOrigin: true,
      }
    }
  }
})
