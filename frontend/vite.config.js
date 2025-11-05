import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vite configuration for GitHub Pages or Render
export default defineConfig({
  plugins: [react()],
  base: "/HealthAndFitness/", // 👈 for GitHub Pages; you can remove this if only using Render
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'build', // ✅ output folder name changed from dist → build
  },
})
