import type { ComputedRef, DeepReadonly } from "vue"

export type CheckboxSize = "sm" | "md" | "lg"

export interface CheckboxProps {
    size?: CheckboxSize
    disabled?: boolean
    indeterminate?: boolean
}

/**
 * チェックボックスの状態（StyleAdapterに渡す用）
 */
export interface CheckboxState {
    size: CheckboxSize
    disabled: boolean
    indeterminate: boolean
    checked: boolean
}

export interface CheckboxAriaAttributes {
    role: "checkbox"
    "aria-checked": boolean | "mixed"
    "aria-disabled"?: boolean
}

/**
 * useCheckbox の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface CheckboxReturn {
    state: DeepReadonly<ComputedRef<CheckboxState>>
    aria_attributes: DeepReadonly<ComputedRef<CheckboxAriaAttributes>>
}
