import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages requires the repo name as the base path.
  // We set this via the VITE_BASE environment variable in our GitHub Action.
  // For Docker/Local usage, it defaults to '/'
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
