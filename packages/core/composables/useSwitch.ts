import { computed, readonly, type Ref } from "vue"
import type { SwitchProps, SwitchReturn, SwitchAriaAttributes, SwitchState } from "../types/switch"

/**
 * Switchコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useSwitch = (
    props: Ref<SwitchProps>,
    checked: Ref<boolean>
): SwitchReturn => {
    const state = computed((): SwitchState => ({
        size: props.value.size ?? "md",
        disabled: props.value.disabled ?? false,
        checked: checked.value
    }))

    const aria_attributes = computed<SwitchAriaAttributes>(() => ({
        role: "switch",
        "aria-checked": state.value.checked,
        "aria-disabled": state.value.disabled || undefined
    }))

    return {
        state: readonly(state),
        aria_attributes: readonly(aria_attributes)
    }
}
