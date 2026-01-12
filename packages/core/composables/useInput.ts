import { computed, ref, readonly, type Ref } from "vue"
import type { InputProps, InputReturn, InputAriaAttributes, InputState } from "../types/input"
import { useUI } from "./useUIConfig"

/**
 * Inputコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useInput = (props: Ref<InputProps>): InputReturn => {
    const ui_config = useUI("input")

    const is_focused = ref(false)

    const state = computed((): InputState => ({
        type: props.value.type ?? "text",
        size: props.value.size ?? ui_config.default_size,
        disabled: props.value.disabled ?? false,
        readonly: props.value.readonly ?? false,
        has_error: !!props.value.error
    }))

    const aria_attributes = computed<InputAriaAttributes>(() => ({
        "aria-invalid": state.value.has_error || undefined,
        "aria-describedby": props.value.error_id,
        "aria-readonly": state.value.readonly || undefined
    }))

    const handleFocus = () => {
        is_focused.value = true
    }

    const handleBlur = () => {
        is_focused.value = false
    }

    return {
        state: readonly(state),
        is_focused,
        aria_attributes: readonly(aria_attributes),
        handleFocus,
        handleBlur
    }
}
