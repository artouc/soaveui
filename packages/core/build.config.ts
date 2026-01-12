import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
    entries: [
        {
            builder: "mkdist",
            input: "./",
            outDir: "./dist",
            pattern: ["**/*.ts", "**/*.vue", "**/*.css"],
            declaration: true
        }
    ],
    clean: true,
    externals: ["vue", "zod", "clsx", "tailwind-merge"]
})
