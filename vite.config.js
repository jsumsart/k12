import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/k12/" : "/",
  build: {
    rollupOptions: {
      input: "app.html"
    }
  },
  logLevel: "error",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  plugins: [react()]
});
