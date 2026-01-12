import { computed, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { ButtonProps, ButtonReturn, ButtonAriaAttributes } from "../types/button"
import { useUI } from "./useUIConfig"

/**
 * Buttonコンポーネントのロジックを提供するComposable
 * variant, size, disabled, loadingに基づいてクラスとaria属性を生成
 * Providerから設定されたデフォルト値を使用
 */
export const useButton = (props: Ref<ButtonProps>): ButtonReturn => {
    const ui_config = useUI("button")

    const is_disabled = computed(() => props.value.disabled ?? false)
    const is_loading = computed(() => props.value.loading ?? false)

    const variant_classes = computed(() => {
        const variant_map: Record<NonNullable<ButtonProps["variant"]>, string> = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        }
        return variant_map[props.value.variant ?? ui_config.default_variant]
    })

    const size_classes = computed(() => {
        const size_map: Record<NonNullable<ButtonProps["size"]>, string> = {
            sm: "h-9 px-3 text-sm",
            md: "h-10 px-4 py-2",
            lg: "h-11 px-8"
        }
        return size_map[props.value.size ?? ui_config.default_size]
    })

    const base_classes = computed(() =>
        cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
            "ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            variant_classes.value,
            size_classes.value,
            is_disabled.value && "opacity-50 cursor-not-allowed",
            is_loading.value && "cursor-wait"
        )
    )

    const aria_attributes = computed<ButtonAriaAttributes>(() => ({
        "aria-disabled": is_disabled.value || undefined,
        "aria-busy": is_loading.value || undefined,
        role: "button"
    }))

    return {
        base_classes,
        is_disabled,
        is_loading,
        aria_attributes
    }
}
