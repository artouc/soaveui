import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { resolve } from "path"
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs"

function copyStyles() {
    return {
        name: "copy-styles",
        closeBundle() {
            const stylesDir = resolve(__dirname, "styles")
            const distStylesDir = resolve(__dirname, "dist/styles")

            if (!existsSync(distStylesDir)) {
                mkdirSync(distStylesDir, { recursive: true })
            }

            const files = readdirSync(stylesDir)
            files.forEach(file => {
                if (file.endsWith(".css")) {
                    copyFileSync(
                        resolve(stylesDir, file),
                        resolve(distStylesDir, file)
                    )
                }
            })
        }
    }
}

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include: ["index.ts", "components/**/*.vue", "components/**/*.ts"],
            outDir: "dist",
            rollupTypes: false,
            insertTypesEntry: true
        }),
        copyStyles()
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "index.ts"),
            formats: ["es"],
            fileName: "index"
        },
        rollupOptions: {
            external: ["vue", "@soave/ui"],
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
