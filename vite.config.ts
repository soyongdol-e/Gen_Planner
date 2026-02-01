import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '5173-iiwvopu7to0ll3x1x19hv-2e1b9533.sandbox.novita.ai',
      '.sandbox.novita.ai',
      'localhost'
    ]
  }
})
