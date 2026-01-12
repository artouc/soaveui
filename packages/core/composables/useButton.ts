import { computed, readonly, type Ref } from "vue"
import type { ButtonProps, ButtonReturn, ButtonAriaAttributes, ButtonState } from "../types/button"
import { useUI } from "./useUIConfig"

/**
 * Buttonコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useButton = (props: Ref<ButtonProps>): ButtonReturn => {
    const ui_config = useUI("button")

    const state = computed((): ButtonState => ({
        variant: props.value.variant ?? ui_config.default_variant,
        size: props.value.size ?? ui_config.default_size,
        disabled: props.value.disabled ?? false,
        loading: props.value.loading ?? false,
        type: props.value.type ?? "button"
    }))

    const aria_attributes = computed<ButtonAriaAttributes>(() => ({
        "aria-disabled": state.value.disabled || undefined,
        "aria-busy": state.value.loading || undefined,
        role: "button",
        type: state.value.type
    }))

    return {
        state: readonly(state),
        aria_attributes: readonly(aria_attributes)
    }
}
