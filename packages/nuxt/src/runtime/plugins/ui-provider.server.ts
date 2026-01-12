import { defineNuxtPlugin } from "#app"
import { useUIProvider } from "@soave/ui"

export default defineNuxtPlugin(() => {
    // Initialize UI Provider on server side for SSR
    // This ensures consistent hydration between server and client
    const config = useUIProvider()

    return {
        provide: {
            soaveUI: config
        }
    }
})
