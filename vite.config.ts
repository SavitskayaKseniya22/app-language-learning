import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": path.resolve("src"),
            "@app": path.resolve("src/app"),
            "@abstracts": path.resolve("src/app/styles/abstracts"),
            "@shared": path.resolve("src/shared"),
            "@images": path.resolve("src/shared/assets/images"),
            "@features": path.resolve("src/features"),

            //
            "@components": path.resolve("src/components"),
            "@modules": path.resolve("src/modules"),
            "@pages": path.resolve("src/pages"),
        },
    },
});
