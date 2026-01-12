import type { ComputedRef, DeepReadonly } from "vue"

export type SwitchSize = "sm" | "md" | "lg"

export interface SwitchProps {
    size?: SwitchSize
    disabled?: boolean
}

/**
 * スイッチの状態（StyleAdapterに渡す用）
 */
export interface SwitchState {
    size: SwitchSize
    disabled: boolean
    checked: boolean
}

export interface SwitchAriaAttributes {
    role: "switch"
    "aria-checked": boolean
    "aria-disabled"?: boolean
}

/**
 * useSwitch の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface SwitchReturn {
    state: DeepReadonly<ComputedRef<SwitchState>>
    aria_attributes: DeepReadonly<ComputedRef<SwitchAriaAttributes>>
}
