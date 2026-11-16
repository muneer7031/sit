import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base + stable file names for the browser build; the SSR build (used only for pre-rendering) keeps defaults.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: "./",
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          output: {
            entryFileNames: "assets/app.js",
            chunkFileNames: "assets/[name].js",
            assetFileNames: "assets/[name][extname]",
          },
        },
      },
}));
