import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": path.resolve("src"),
            "@api": path.resolve("src/api"),
            "@assets": path.resolve("src/assets"),
            "@images": path.resolve("src/assets/images"),
            "@abstracts": path.resolve("src/assets/styles/abstracts"),
            "@components": path.resolve("src/components"),
            "@modules": path.resolve("src/modules"),
            "@pages": path.resolve("src/pages"),
        },
    },
});
