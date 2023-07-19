import { defineConfig } from 'vite'
import preact from "@preact/preset-vite";
import svgr from "vite-plugin-svgr"
import pluginRewriteAll from 'vite-plugin-rewrite-all'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pluginRewriteAll()
    ,svgr()
    ,preact()
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
})
