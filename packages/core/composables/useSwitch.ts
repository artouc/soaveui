import { computed, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { SwitchProps, SwitchReturn, SwitchAriaAttributes } from "../types/switch"

/**
 * Switchコンポーネントのロジックを提供するComposable
 * size, disabledに基づいてクラスとaria属性を生成
 */
export const useSwitch = (
    props: Ref<SwitchProps>,
    checked: Ref<boolean>
): SwitchReturn => {
    const is_disabled = computed(() => props.value.disabled ?? false)

    const track_size_classes = computed(() => {
        const size_map: Record<NonNullable<SwitchProps["size"]>, string> = {
            sm: "h-5 w-9",
            md: "h-6 w-11",
            lg: "h-7 w-14"
        }
        return size_map[props.value.size ?? "md"]
    })

    const track_classes = computed(() =>
        cn(
            "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
            track_size_classes.value
        )
    )

    const thumb_size_classes = computed(() => {
        const size_map: Record<NonNullable<SwitchProps["size"]>, string> = {
            sm: "h-4 w-4 data-[state=checked]:translate-x-4",
            md: "h-5 w-5 data-[state=checked]:translate-x-5",
            lg: "h-6 w-6 data-[state=checked]:translate-x-7"
        }
        return size_map[props.value.size ?? "md"]
    })

    const thumb_classes = computed(() =>
        cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0",
            "transition-transform",
            "data-[state=unchecked]:translate-x-0",
            thumb_size_classes.value
        )
    )

    const aria_attributes = computed<SwitchAriaAttributes>(() => ({
        role: "switch",
        "aria-checked": checked.value,
        "aria-disabled": is_disabled.value || undefined
    }))

    return {
        track_classes,
        thumb_classes,
        is_disabled,
        aria_attributes
    }
}
