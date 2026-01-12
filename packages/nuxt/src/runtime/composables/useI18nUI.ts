import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from "vue"

export interface UITranslations {
    // Pagination
    pagination: {
        previous: string
        next: string
        first: string
        last: string
        page: string
        showing: string
        of: string
        results: string
    }
    // DataTable
    data_table: {
        no_results: string
        select_all: string
        select_row: string
        actions: string
        loading: string
        sort_ascending: string
        sort_descending: string
    }
    // Breadcrumbs
    breadcrumbs: {
        home: string
        navigation: string
    }
    // Common
    common: {
        loading: string
        error: string
        empty: string
        cancel: string
        confirm: string
        save: string
        delete: string
        edit: string
        create: string
        search: string
        filter: string
        clear: string
        close: string
        open: string
        submit: string
        reset: string
    }
}

const DEFAULT_TRANSLATIONS: UITranslations = {
    pagination: {
        previous: "Previous",
        next: "Next",
        first: "First",
        last: "Last",
        page: "Page",
        showing: "Showing",
        of: "of",
        results: "results"
    },
    data_table: {
        no_results: "No results found.",
        select_all: "Select all",
        select_row: "Select row",
        actions: "Actions",
        loading: "Loading...",
        sort_ascending: "Sort ascending",
        sort_descending: "Sort descending"
    },
    breadcrumbs: {
        home: "Home",
        navigation: "Breadcrumb"
    },
    common: {
        loading: "Loading...",
        error: "An error occurred",
        empty: "No data available",
        cancel: "Cancel",
        confirm: "Confirm",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        search: "Search",
        filter: "Filter",
        clear: "Clear",
        close: "Close",
        open: "Open",
        submit: "Submit",
        reset: "Reset"
    }
}

export interface UseI18nUIOptions {
    translations?: Partial<UITranslations>
    use_nuxt_i18n?: boolean
}

export interface UseI18nUIReturn {
    t: <K extends keyof UITranslations>(
        namespace: K,
        key: keyof UITranslations[K]
    ) => ComputedRef<string>
    translations: UITranslations
}

let nuxt_i18n_available = false
let use_i18n_function: (() => { t: (key: string) => string }) | null = null

// Attempt to detect @nuxtjs/i18n
try {
    // This will be resolved at runtime if @nuxtjs/i18n is installed
    const i18n_module = import.meta.glob<{ useI18n: () => { t: (key: string) => string } }>("/node_modules/@nuxtjs/i18n/**/*.js", { eager: false })
    nuxt_i18n_available = Object.keys(i18n_module).length > 0
} catch {
    nuxt_i18n_available = false
}

export function useI18nUI(options: UseI18nUIOptions = {}): UseI18nUIReturn {
    const { translations: custom_translations = {}, use_nuxt_i18n = nuxt_i18n_available } = options

    // Merge custom translations with defaults
    const merged_translations = mergeDeep(DEFAULT_TRANSLATIONS, custom_translations) as UITranslations

    const t = <K extends keyof UITranslations>(
        namespace: K,
        key: keyof UITranslations[K]
    ): ComputedRef<string> => {
        return computed(() => {
            // If using Nuxt i18n, try to get translation from there first
            if (use_nuxt_i18n && use_i18n_function) {
                const i18n = use_i18n_function()
                const i18n_key = `soave_ui.${namespace}.${String(key)}`
                const translated = i18n.t(i18n_key)
                // If translation exists and is different from the key, use it
                if (translated !== i18n_key) {
                    return translated
                }
            }

            // Fall back to merged translations
            const namespace_translations = merged_translations[namespace]
            if (namespace_translations && key in namespace_translations) {
                return namespace_translations[key as keyof typeof namespace_translations] as string
            }

            return String(key)
        })
    }

    return {
        t,
        translations: merged_translations
    }
}

export function createUITranslations(translations: MaybeRefOrGetter<Partial<UITranslations>>): UITranslations {
    const resolved = toValue(translations)
    return mergeDeep(DEFAULT_TRANSLATIONS, resolved) as UITranslations
}

export function getDefaultTranslations(): UITranslations {
    return { ...DEFAULT_TRANSLATIONS }
}

// Deep merge utility
function mergeDeep<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
    const output = { ...target }
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const source_value = source[key]
            const target_value = output[key]
            if (isObject(source_value) && isObject(target_value)) {
                output[key] = mergeDeep(
                    target_value as Record<string, unknown>,
                    source_value as Record<string, unknown>
                ) as T[typeof key]
            } else if (source_value !== undefined) {
                output[key] = source_value as T[typeof key]
            }
        }
    }
    return output
}

function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === "object" && !Array.isArray(item)
}
