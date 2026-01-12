import { defineNuxtPlugin, useRuntimeConfig } from "#app"
import {
    useUIProvider,
    tailwindAdapter,
    cssVariablesAdapter,
    headlessAdapter
} from "@soave/ui"
import type { StyleAdapter } from "@soave/ui"

export default defineNuxtPlugin(() => {
    const runtime_config = useRuntimeConfig()
    const soave_config = runtime_config.public.soaveUI

    // Select adapter based on config
    const adapter_map: Record<string, StyleAdapter> = {
        tailwind: tailwindAdapter,
        "css-variables": cssVariablesAdapter,
        headless: headlessAdapter
    }

    const selected_adapter = adapter_map[soave_config?.adapter ?? "tailwind"] ?? tailwindAdapter

    // Initialize UI Provider on server side for SSR
    // This ensures consistent hydration between server and client
    const context = useUIProvider({}, selected_adapter)

    return {
        provide: {
            soaveUI: context
        }
    }
})
