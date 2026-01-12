import { defineNuxtPlugin } from "#app"
import { useUIProvider } from "@soave/ui"

export default defineNuxtPlugin(() => {
    // Initialize UI Provider on client side
    // This ensures the provider context is available throughout the app
    const config = useUIProvider()

    return {
        provide: {
            soaveUI: config
        }
    }
})
