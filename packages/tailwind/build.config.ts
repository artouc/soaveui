import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
    entries: [
        {
            builder: "mkdist",
            input: "./",
            outDir: "./dist",
            pattern: ["**/*.ts", "**/*.vue"],
            declaration: true
        }
    ],
    clean: true,
    externals: ["vue", "@soave/ui", "tailwindcss"]
})
