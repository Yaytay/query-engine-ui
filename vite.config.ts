import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(),react()],
  esbuild: {
    loader: "tsx"  
  },
  server: {
    open: true,
    port: 5173,
  },
})
