import { useRoute } from "#app"
import { computed, ref, type ComputedRef, type Ref } from "vue"
import type { BreadcrumbItem } from "../../types"

export interface UseBreadcrumbsOptions {
    home_label?: string
    home_href?: string
    home_icon?: string
    include_home?: boolean
    label_transformer?: (segment: string) => string
    custom_labels?: Record<string, string>
}

export interface UseBreadcrumbsReturn {
    breadcrumbs: ComputedRef<BreadcrumbItem[]>
    current: ComputedRef<BreadcrumbItem | undefined>
    set: (items: BreadcrumbItem[]) => void
    append: (item: BreadcrumbItem) => void
    reset: () => void
}

const default_label_transformer = (segment: string): string => {
    return segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}): UseBreadcrumbsReturn {
    const route = useRoute()

    const {
        home_label = "Home",
        home_href = "/",
        home_icon,
        include_home = true,
        label_transformer = default_label_transformer,
        custom_labels = {}
    } = options

    const manual_items: Ref<BreadcrumbItem[] | null> = ref(null)

    const auto_breadcrumbs = computed<BreadcrumbItem[]>(() => {
        const path_segments = route.path.split("/").filter(Boolean)
        const items: BreadcrumbItem[] = []

        if (include_home) {
            items.push({
                label: home_label,
                href: home_href,
                icon: home_icon,
                current: path_segments.length === 0
            })
        }

        let accumulated_path = ""

        path_segments.forEach((segment, index) => {
            // Skip dynamic route segments (e.g., [id])
            if (segment.startsWith("[") && segment.endsWith("]")) {
                const param_name = segment.slice(1, -1)
                const param_value = route.params[param_name]
                if (param_value) {
                    segment = String(param_value)
                }
            }

            accumulated_path += `/${segment}`
            const is_last = index === path_segments.length - 1

            const label = custom_labels[segment] || custom_labels[accumulated_path] || label_transformer(segment)

            items.push({
                label,
                href: is_last ? undefined : accumulated_path,
                current: is_last,
                disabled: is_last
            })
        })

        return items
    })

    const breadcrumbs = computed<BreadcrumbItem[]>(() => {
        return manual_items.value ?? auto_breadcrumbs.value
    })

    const current = computed<BreadcrumbItem | undefined>(() => {
        return breadcrumbs.value.find(item => item.current)
    })

    const set = (items: BreadcrumbItem[]): void => {
        manual_items.value = items
    }

    const append = (item: BreadcrumbItem): void => {
        if (manual_items.value) {
            manual_items.value = [...manual_items.value, item]
        } else {
            manual_items.value = [...auto_breadcrumbs.value, item]
        }
    }

    const reset = (): void => {
        manual_items.value = null
    }

    return {
        breadcrumbs,
        current,
        set,
        append,
        reset
    }
}
