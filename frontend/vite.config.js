import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* eslint-disable no-undef */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    open: true,  // Auto-open browser
    host: process.env.VITE_HOST || '0.0.0.0',  // Network access
    port: parseInt(process.env.VITE_PORT) || 5173,  // Port
  }
})