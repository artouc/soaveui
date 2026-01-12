import {
    defineNuxtModule,
    createResolver,
    addComponentsDir,
    addImportsDir,
    addPlugin
} from "@nuxt/kit"

export type StyleAdapterName = "tailwind" | "css-variables" | "headless"

export interface SoaveNuxtModuleOptions {
    prefix?: string
    global?: boolean
    adapter?: StyleAdapterName
    i18n?: {
        enabled?: boolean
        default_locale?: string
    }
}

export default defineNuxtModule<SoaveNuxtModuleOptions>({
    meta: {
        name: "@soave/nuxt-ui",
        configKey: "soaveUI",
        compatibility: {
            nuxt: "^3.0.0 || ^4.0.0"
        }
    },
    defaults: {
        prefix: "",
        global: true,
        adapter: "tailwind",
        i18n: {
            enabled: false,
            default_locale: "en"
        }
    },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        // Add core UI package transpile
        nuxt.options.build.transpile.push("@soave/ui")

        // Add runtime composables
        addImportsDir(resolver.resolve("./runtime/composables"))

        // Add runtime components
        await addComponentsDir({
            path: resolver.resolve("./runtime/components"),
            prefix: options.prefix,
            global: options.global
        })

        // Add core UI components from @soave/ui
        await addComponentsDir({
            path: resolver.resolve("../../core/components/ui"),
            prefix: options.prefix,
            global: options.global
        })

        // Add CSS Variables stylesheet if using css-variables adapter
        if (options.adapter === "css-variables") {
            nuxt.options.css.push(
                resolver.resolve("../../core/styles/css-variables.css")
            )
        }

        // Add UI Provider plugin
        addPlugin({
            src: resolver.resolve("./runtime/plugins/ui-provider.client"),
            mode: "client"
        })

        addPlugin({
            src: resolver.resolve("./runtime/plugins/ui-provider.server"),
            mode: "server"
        })

        // Store module options in runtime config
        nuxt.options.runtimeConfig.public.soaveUI = {
            adapter: options.adapter,
            i18n: options.i18n
        }

        // Add type declarations
        nuxt.hook("prepare:types", ({ references }) => {
            references.push({
                path: resolver.resolve("./types.d.ts")
            })
        })
    }
})

declare module "@nuxt/schema" {
    interface PublicRuntimeConfig {
        soaveUI: {
            adapter: StyleAdapterName
            i18n: {
                enabled: boolean
                default_locale: string
            }
        }
    }
}
