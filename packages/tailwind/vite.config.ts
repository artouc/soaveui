import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { resolve } from "path"

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include: ["index.ts", "components/**/*.vue", "components/**/*.ts"],
            outDir: "dist",
            rollupTypes: false,
            insertTypesEntry: true
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "index.ts"),
            formats: ["es"],
            fileName: "index"
        },
        rollupOptions: {
            external: ["vue", "@soave/ui", "tailwindcss"],
            output: {
                globals: {
                    vue: "Vue"
                },
                preserveModules: false
            }
        },
        sourcemap: true,
        minify: false
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./")
        }
    }
})
