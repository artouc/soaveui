import { computed, ref, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { InputProps, InputReturn, InputAriaAttributes } from "../types/input"
import { useUI } from "./useUIConfig"

/**
 * Inputコンポーネントのロジックを提供するComposable
 * size, error, disabled, readonlyに基づいてクラスとaria属性を生成
 * Providerから設定されたデフォルト値を使用
 */
export const useInput = (props: Ref<InputProps>): InputReturn => {
    const ui_config = useUI("input")

    const is_focused = ref(false)
    const has_error = computed(() => !!props.value.error)
    const is_disabled = computed(() => props.value.disabled ?? false)
    const is_readonly = computed(() => props.value.readonly ?? false)

    const size_classes = computed(() => {
        const size_map: Record<NonNullable<InputProps["size"]>, string> = {
            sm: "h-9 text-sm",
            md: "h-10",
            lg: "h-11 text-lg"
        }
        return size_map[props.value.size ?? ui_config.default_size]
    })

    const base_classes = computed(() =>
        cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            size_classes.value,
            has_error.value && "border-destructive focus-visible:ring-destructive",
            is_readonly.value && "bg-muted"
        )
    )

    const aria_attributes = computed<InputAriaAttributes>(() => ({
        "aria-invalid": has_error.value || undefined,
        "aria-describedby": props.value.error_id,
        "aria-readonly": is_readonly.value || undefined
    }))

    const handleFocus = () => {
        is_focused.value = true
    }

    const handleBlur = () => {
        is_focused.value = false
    }

    return {
        base_classes,
        is_focused,
        has_error,
        is_disabled,
        is_readonly,
        aria_attributes,
        handleFocus,
        handleBlur
    }
}
