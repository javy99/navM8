import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [react(), checker({ typescript: true }), eslint()],
  optimizeDeps: {
    include: ["country-list"],
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});