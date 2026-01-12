export type ThemeMode = "light" | "dark" | "system"

export interface ThemeColors {
    background: string
    foreground: string
    card: string
    card_foreground: string
    popover: string
    popover_foreground: string
    primary: string
    primary_foreground: string
    secondary: string
    secondary_foreground: string
    muted: string
    muted_foreground: string
    accent: string
    accent_foreground: string
    destructive: string
    destructive_foreground: string
    border: string
    input: string
    ring: string
}

export interface Theme {
    name: string
    colors: {
        light: ThemeColors
        dark: ThemeColors
    }
}

export interface ThemeConfig {
    default_mode: ThemeMode
    storage_key: string
    attribute: string
    themes: Theme[]
}

export interface ThemeReturn {
    mode: ThemeMode
    resolved_mode: "light" | "dark"
    setMode: (mode: ThemeMode) => void
    toggleMode: () => void
}

export const DEFAULT_LIGHT_COLORS: ThemeColors = {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    card_foreground: "222.2 84% 4.9%",
    popover: "0 0% 100%",
    popover_foreground: "222.2 84% 4.9%",
    primary: "222.2 47.4% 11.2%",
    primary_foreground: "210 40% 98%",
    secondary: "210 40% 96.1%",
    secondary_foreground: "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    muted_foreground: "215.4 16.3% 46.9%",
    accent: "210 40% 96.1%",
    accent_foreground: "222.2 47.4% 11.2%",
    destructive: "0 84.2% 60.2%",
    destructive_foreground: "210 40% 98%",
    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "222.2 84% 4.9%"
}

export const DEFAULT_DARK_COLORS: ThemeColors = {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 4.9%",
    card_foreground: "210 40% 98%",
    popover: "222.2 84% 4.9%",
    popover_foreground: "210 40% 98%",
    primary: "210 40% 98%",
    primary_foreground: "222.2 47.4% 11.2%",
    secondary: "217.2 32.6% 17.5%",
    secondary_foreground: "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    muted_foreground: "215 20.2% 65.1%",
    accent: "217.2 32.6% 17.5%",
    accent_foreground: "210 40% 98%",
    destructive: "0 62.8% 30.6%",
    destructive_foreground: "210 40% 98%",
    border: "217.2 32.6% 17.5%",
    input: "217.2 32.6% 17.5%",
    ring: "212.7 26.8% 83.9%"
}
