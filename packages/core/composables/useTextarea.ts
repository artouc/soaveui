import { computed, ref, readonly, type Ref } from "vue"
import type { TextareaProps, TextareaReturn, TextareaAriaAttributes, TextareaState } from "../types/textarea"

/**
 * Textareaコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useTextarea = (props: Ref<TextareaProps>): TextareaReturn => {
    const is_focused = ref(false)

    const state = computed((): TextareaState => ({
        size: props.value.size ?? "md",
        disabled: props.value.disabled ?? false,
        readonly: props.value.readonly ?? false,
        has_error: !!props.value.error,
        resize: props.value.resize ?? "vertical"
    }))

    const aria_attributes = computed<TextareaAriaAttributes>(() => ({
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
