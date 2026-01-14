import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// PWA plugin disabled due to workbox-build dependency issues in build environment
// Manifest.json is still available in public/ for PWA functionality
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // PWA plugin temporarily disabled - manifest.json in public/ provides basic PWA support
    // To re-enable: install workbox-build and uncomment VitePWA config
  ],
  server: {
    port: 3000
  }
})