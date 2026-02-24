// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 51568,
        proxy: {
            "/api": {
                target: "https://localhost:7210", //Backend goes here
                changeOrigin: true,
                secure: false, // for self-signed certs
            },
        },
    },
});