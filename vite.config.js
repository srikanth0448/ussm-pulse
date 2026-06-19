import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    base: mode === "development" ? "/" : "/testing/react/usm-pulse/",
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico"],
        manifest: {
          name: "USM Pulse",
          short_name: "USM Pulse",
          description: "Employee Management System",
          theme_color: "#1a3691",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/pulselogowhite.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pulselogowhite.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },

        devOptions: {
          enabled: true,
        },
      }),
    ],
  };
});
