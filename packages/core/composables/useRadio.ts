import { computed, inject, readonly, type Ref } from "vue"
import type { RadioItemProps, RadioItemReturn, RadioAriaAttributes, RadioGroupContext, RadioItemState } from "../types/radio"
import { RADIO_GROUP_KEY } from "../types/radio"
import { COMPONENT_ERRORS } from "../constants/errors"

/**
 * RadioItemコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useRadioItem = (props: Ref<RadioItemProps>): RadioItemReturn => {
    const context = inject<RadioGroupContext | null>(RADIO_GROUP_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const state = computed((): RadioItemState => ({
        size: props.value.size ?? "md",
        disabled: props.value.disabled ?? context.disabled.value,
        checked: context.model_value.value === props.value.value
    }))

    const aria_attributes = computed<RadioAriaAttributes>(() => ({
        role: "radio",
        "aria-checked": state.value.checked,
        "aria-disabled": state.value.disabled || undefined
    }))

    return {
        state: readonly(state),
        aria_attributes: readonly(aria_attributes)
    }
}
