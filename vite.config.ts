import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
  },
  build: {
    minify: "esbuild",
    terserOptions: {
      compress: {
        drop_console: true, // Xóa console.log()
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // if (id.includes("react")) return "react-vendor"; // React riêng
            if (id.includes("lodash")) return "lodash-vendor"; // Lodash riêng
            if (id.includes("firebase")) return "firebase-vendor"; // Firebase riêng
            return "vendor"; // Còn lại gom vào vendor
          }
        },
      },
    },
  },
})