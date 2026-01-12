import { computed, ref, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { TextareaProps, TextareaReturn, TextareaAriaAttributes } from "../types/textarea"

/**
 * Textareaコンポーネントのロジックを提供するComposable
 * error, disabled, readonly, resizeに基づいてクラスとaria属性を生成
 */
export const useTextarea = (props: Ref<TextareaProps>): TextareaReturn => {
    const is_focused = ref(false)
    const has_error = computed(() => !!props.value.error)
    const is_disabled = computed(() => props.value.disabled ?? false)
    const is_readonly = computed(() => props.value.readonly ?? false)

    const resize_classes = computed(() => {
        const resize_map: Record<NonNullable<TextareaProps["resize"]>, string> = {
            none: "resize-none",
            vertical: "resize-y",
            horizontal: "resize-x",
            both: "resize"
        }
        return resize_map[props.value.resize ?? "vertical"]
    })

    const base_classes = computed(() =>
        cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            resize_classes.value,
            has_error.value && "border-destructive focus-visible:ring-destructive",
            is_readonly.value && "bg-muted"
        )
    )

    const aria_attributes = computed<TextareaAriaAttributes>(() => ({
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
