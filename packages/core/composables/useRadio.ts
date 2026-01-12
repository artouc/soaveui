import { computed, inject, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { RadioItemProps, RadioItemReturn, RadioAriaAttributes, RadioGroupContext } from "../types/radio"
import { RADIO_GROUP_KEY } from "../types/radio"
import { COMPONENT_ERRORS } from "../constants/errors"

/**
 * RadioItemコンポーネントのロジックを提供するComposable
 * size, disabled, valueに基づいてクラスとaria属性を生成
 */
export const useRadioItem = (props: Ref<RadioItemProps>): RadioItemReturn => {
    const context = inject<RadioGroupContext | null>(RADIO_GROUP_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const is_disabled = computed(() => props.value.disabled ?? context.disabled.value)
    const is_checked = computed(() => context.model_value.value === props.value.value)

    const size_classes = computed(() => {
        const size_map: Record<NonNullable<RadioItemProps["size"]>, string> = {
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-6 w-6"
        }
        return size_map[props.value.size ?? "md"]
    })

    const base_classes = computed(() =>
        cn(
            "aspect-square rounded-full border border-primary text-primary",
            "ring-offset-background",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            size_classes.value
        )
    )

    const indicator_size_classes = computed(() => {
        const size_map: Record<NonNullable<RadioItemProps["size"]>, string> = {
            sm: "h-2 w-2",
            md: "h-2.5 w-2.5",
            lg: "h-3 w-3"
        }
        return size_map[props.value.size ?? "md"]
    })

    const indicator_classes = computed(() =>
        cn(
            "flex items-center justify-center",
            indicator_size_classes.value
        )
    )

    const aria_attributes = computed<RadioAriaAttributes>(() => ({
        role: "radio",
        "aria-checked": is_checked.value,
        "aria-disabled": is_disabled.value || undefined
    }))

    return {
        base_classes,
        indicator_classes,
        is_checked,
        is_disabled,
        aria_attributes
    }
}
