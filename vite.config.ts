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
    headers: {
      'Content-Security-Policy': "default-src 'self' http://localhost:8000/; img-src 'self'; style-src 'self' 'unsafe-inline' 'unsafe-hashes' https://cdn.form.io/; connect-src 'self' http://localhost:8000/ http://localhost:8001/; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.form.io/"
      , 'Permissions-Policy': "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), microphone=(), magnetometer=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), web-share=(), xr-spatial-tracking=()"
      , 'Referrer-Policy': "same-origin"
      , 'Strict-Transport-Security': "max-age=63072000"
      , 'X-Content-Type-Options': "nosniff"
      , 'X-Frame-Options': 'SAMEORIGIN'
    }
  },
  build: {
    assetsInlineLimit: 0 // 👈 disables inlining of small assets
  }
})
