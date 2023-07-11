import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import pluginRewriteAll from 'vite-plugin-rewrite-all'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [pluginRewriteAll(),svgr(),react()],
  base: "",
  appType: "spa",
  esbuild: {
    loader: "tsx"  
  },
  server: {
    open: true,
    port: 5173,
  },
})
