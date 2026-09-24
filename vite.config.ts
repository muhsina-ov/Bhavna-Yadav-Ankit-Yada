import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

// True SPA build — no TanStack Start, no Nitro, no SSR. Optimized for Cloudflare Workers Static Assets.
export default defineConfig({
  base: "/",
  server: { port: 5500 },
  plugins: [react(), tsconfigPaths(), tailwindcss(), cloudflare()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("@tanstack")) return "vendor";
            if (id.includes("motion")) return "motion";
            if (id.includes("lucide-react") || id.includes("sonner") || id.includes("radix")) return "ui";
          }
        },
        // Cache-busting, Cloudflare-friendly filenames
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  preview: { port: 5500 },
});
