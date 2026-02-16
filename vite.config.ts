import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const rawBase = process.env.VITE_BASE_URL;
  const defaultBase = command === "build" ? "./" : "/";
  const selectedBase = rawBase ?? defaultBase;
  const normalizedBase = selectedBase.startsWith(".")
    ? "./"
    : ((selectedBase.startsWith("/") ? selectedBase : `/${selectedBase}`) + (selectedBase.endsWith("/") ? "" : "/"));

  return {
    base: normalizedBase,
    server: {
      host: "0.0.0.0",
      port: 8081,
      strictPort: true,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
