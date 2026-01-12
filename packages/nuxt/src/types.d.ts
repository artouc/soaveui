import type { SoaveNuxtModuleOptions } from "./types"

declare module "@nuxt/schema" {
    interface NuxtConfig {
        soaveUI?: SoaveNuxtModuleOptions
    }
    interface NuxtOptions {
        soaveUI?: SoaveNuxtModuleOptions
    }
}

export {}
