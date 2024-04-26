import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ include: ["lib"] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.tsx"),
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "",
        assetFileNames: "index.css",
      },
      external: ["react", "react/jsx-runtime", "react-dom"],
    },
  },
});
