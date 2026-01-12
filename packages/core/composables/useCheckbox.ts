import { computed, readonly, type Ref } from "vue"
import type { CheckboxProps, CheckboxReturn, CheckboxAriaAttributes, CheckboxState } from "../types/checkbox"

/**
 * Checkboxコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useCheckbox = (
    props: Ref<CheckboxProps>,
    checked: Ref<boolean>
): CheckboxReturn => {
    const state = computed((): CheckboxState => ({
        size: props.value.size ?? "md",
        disabled: props.value.disabled ?? false,
        indeterminate: props.value.indeterminate ?? false,
        checked: checked.value
    }))

    const aria_attributes = computed<CheckboxAriaAttributes>(() => ({
        role: "checkbox",
        "aria-checked": state.value.indeterminate ? "mixed" : state.value.checked,
        "aria-disabled": state.value.disabled || undefined
    }))

    return {
        state: readonly(state),
        aria_attributes: readonly(aria_attributes)
    }
}
