import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
export default defineConfig({
  plugins: [react(), libInjectCss(), dts({ include: ["lib"] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.tsx"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
});
