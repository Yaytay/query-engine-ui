import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr()
    ,react()
    ,tailwindcss()
  ],
  base: "",
  appType: "spa",
  esbuild: {
    loader: "tsx"  
  },
  server: {
    open: true,
    port: 5173,
  },
  build: {
    assetsInlineLimit: 0 // 👈 disables inlining of small assets
  }
})
