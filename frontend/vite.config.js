import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vite configuration for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "/HealthAndFitness/", // 👈 Add this line — repo name as base path
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})
