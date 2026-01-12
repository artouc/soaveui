import { computed, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { CheckboxProps, CheckboxReturn, CheckboxAriaAttributes } from "../types/checkbox"

/**
 * Checkboxコンポーネントのロジックを提供するComposable
 * size, disabled, indeterminateに基づいてクラスとaria属性を生成
 */
export const useCheckbox = (
    props: Ref<CheckboxProps>,
    checked: Ref<boolean>
): CheckboxReturn => {
    const is_disabled = computed(() => props.value.disabled ?? false)
    const is_indeterminate = computed(() => props.value.indeterminate ?? false)

    const size_classes = computed(() => {
        const size_map: Record<NonNullable<CheckboxProps["size"]>, string> = {
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-6 w-6"
        }
        return size_map[props.value.size ?? "md"]
    })

    const base_classes = computed(() =>
        cn(
            "peer shrink-0 rounded-sm border border-primary",
            "ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
            size_classes.value
        )
    )

    const indicator_size_classes = computed(() => {
        const size_map: Record<NonNullable<CheckboxProps["size"]>, string> = {
            sm: "h-3 w-3",
            md: "h-4 w-4",
            lg: "h-5 w-5"
        }
        return size_map[props.value.size ?? "md"]
    })

    const indicator_classes = computed(() =>
        cn(
            "flex items-center justify-center text-current",
            indicator_size_classes.value
        )
    )

    const aria_attributes = computed<CheckboxAriaAttributes>(() => ({
        role: "checkbox",
        "aria-checked": is_indeterminate.value ? "mixed" : checked.value,
        "aria-disabled": is_disabled.value || undefined
    }))

    return {
        base_classes,
        indicator_classes,
        is_disabled,
        is_indeterminate,
        aria_attributes
    }
}
