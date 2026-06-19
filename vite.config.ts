import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Site utilisateur GitHub Pages (akaloic.github.io) → servi à la racine, donc base = '/'.
// VITE_BASE reste surchargeable pour un éventuel déploiement sous sous-chemin.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5175 },
})
