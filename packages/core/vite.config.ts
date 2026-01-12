import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { resolve } from "path"

export default defineConfig({
    root: __dirname,
    plugins: [
        vue(),
        dts({
            include: ["index.ts", "composables/**/*.ts", "types/**/*.ts", "utils/**/*.ts", "constants/**/*.ts", "adapters/**/*.ts", "components/**/*.ts", "components/**/*.vue"],
            outDir: "dist",
            rollupTypes: false,
            insertTypesEntry: true
        })
    ],
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "index.ts"),
                composables: resolve(__dirname, "composables/index.ts"),
                adapters: resolve(__dirname, "adapters/index.ts")
            },
            formats: ["es"]
        },
        rollupOptions: {
            external: ["vue", "zod", "clsx", "tailwind-merge"],
            output: {
                globals: {
                    vue: "Vue"
                },
                preserveModules: false,
                entryFileNames: "[name].mjs"
            }
        },
        sourcemap: true,
        minify: false
    },
    resolve: {
        alias: {
            "~": resolve(__dirname, "./"),
            "@composables": resolve(__dirname, "./composables"),
            "@types": resolve(__dirname, "./types"),
            "@utils": resolve(__dirname, "./utils"),
            "@constants": resolve(__dirname, "./constants"),
            "@adapters": resolve(__dirname, "./adapters")
        }
    }
})
