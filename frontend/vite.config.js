import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vite configuration for GitHub Pages or Render
export default defineConfig({
  plugins: [react()],
  base: "/", // Root path for deployment
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist', // Standard Vite output directory
  },
})
