import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on 0.0.0.0 so the droplet is reachable from your browser
    port: 5173,
  },
})
