import { ref, computed, watch, onMounted, onUnmounted, type Ref, type ComputedRef } from "vue"
import type { ThemeMode, ThemeColors, DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS } from "../types/theme"

export interface UseThemeOptions {
    default_mode?: ThemeMode
    storage_key?: string
    attribute?: string
}

export interface UseThemeReturn {
    mode: Ref<ThemeMode>
    resolved_mode: ComputedRef<"light" | "dark">
    setMode: (mode: ThemeMode) => void
    toggleMode: () => void
}

const DEFAULT_OPTIONS: Required<UseThemeOptions> = {
    default_mode: "system",
    storage_key: "soave-ui-theme",
    attribute: "data-theme"
}

export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
    const merged_options = { ...DEFAULT_OPTIONS, ...options }
    const mode = ref<ThemeMode>(merged_options.default_mode)
    let media_query: MediaQueryList | null = null

    const getSystemTheme = (): "light" | "dark" => {
        if (typeof window === "undefined") return "light"
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    const resolved_mode = computed<"light" | "dark">(() => {
        if (mode.value === "system") {
            return getSystemTheme()
        }
        return mode.value
    })

    const applyTheme = (theme: "light" | "dark"): void => {
        if (typeof document === "undefined") return

        const root = document.documentElement

        // Set the attribute on the root element
        root.setAttribute(merged_options.attribute, theme)

        // Also set the class for Tailwind dark mode
        if (theme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
    }

    const setMode = (new_mode: ThemeMode): void => {
        mode.value = new_mode

        // Save to localStorage
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(merged_options.storage_key, new_mode)
        }

        applyTheme(resolved_mode.value)
    }

    const toggleMode = (): void => {
        const next_mode = resolved_mode.value === "light" ? "dark" : "light"
        setMode(next_mode)
    }

    const handleSystemThemeChange = (event: MediaQueryListEvent): void => {
        if (mode.value === "system") {
            applyTheme(event.matches ? "dark" : "light")
        }
    }

    onMounted(() => {
        // Load from localStorage
        if (typeof localStorage !== "undefined") {
            const stored = localStorage.getItem(merged_options.storage_key) as ThemeMode | null
            if (stored && ["light", "dark", "system"].includes(stored)) {
                mode.value = stored
            }
        }

        // Listen for system theme changes
        if (typeof window !== "undefined") {
            media_query = window.matchMedia("(prefers-color-scheme: dark)")
            media_query.addEventListener("change", handleSystemThemeChange)
        }

        // Apply initial theme
        applyTheme(resolved_mode.value)
    })

    onUnmounted(() => {
        if (media_query) {
            media_query.removeEventListener("change", handleSystemThemeChange)
        }
    })

    watch(mode, () => {
        applyTheme(resolved_mode.value)
    })

    return {
        mode,
        resolved_mode,
        setMode,
        toggleMode
    }
}

export function generateThemeCSS(light: ThemeColors, dark: ThemeColors): string {
    const formatColor = (key: string, value: string): string => {
        const css_key = key.replace(/_/g, "-")
        return `  --${css_key}: ${value};`
    }

    const lightCSS = Object.entries(light)
        .map(([key, value]) => formatColor(key, value))
        .join("\n")

    const darkCSS = Object.entries(dark)
        .map(([key, value]) => formatColor(key, value))
        .join("\n")

    return `:root {\n${lightCSS}\n}\n\n.dark {\n${darkCSS}\n}`
}
