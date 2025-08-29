import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const SENTRY_PROJECT_ID = "4509910753345616";
const SENTRY_INGEST_HOST =
  "b2ecd2d8f44305c2fcd9d6483dbe09f1@o4509910719725568.ingest.de.sentry.io";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 1573,
    strictPort: true,
    proxy: {
      "/sentry-tunnel": {
        target: `https://${SENTRY_INGEST_HOST}`,
        changeOrigin: true,
        secure: true,
        rewrite: () => `/api/${SENTRY_PROJECT_ID}/envelope/`,
      },
    },
  },
});
