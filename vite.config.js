import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'OPD Saathi',
        short_name: 'OPDSaathi',
        description: 'Smart queue management and accessible navigation for government hospitals',
        theme_color: '#0B5CAD',
        background_color: '#F3F7FB',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 192 192%27%3E%3Crect width=%27192%27 height=%27192%27 rx=%2738%27 fill=%27%230B5CAD%27/%3E%3Cpath d=%27M72 32h48v48h48v48h-48v48H72v-48H24V80h48z%27 fill=%27white%27/%3E%3C/svg%3E',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 512 512%27%3E%3Crect width=%27512%27 height=%27512%27 rx=%27100%27 fill=%27%230B5CAD%27/%3E%3Cpath d=%27M192 85h128v128h128v128H320v128H192V341H64V213h128z%27 fill=%27white%27/%3E%3C/svg%3E',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  server: { port: 5173 },
});
