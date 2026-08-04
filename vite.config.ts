import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Sanitize emitted asset names: source files contain spaces and "&",
        // which break the publish upload/CDN step.
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "asset";
          const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : "";
          const base = (name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "asset";
          return `assets/${base}-[hash].${ext || "bin"}`;
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
