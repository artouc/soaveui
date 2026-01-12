import type { ComputedRef, DeepReadonly } from "vue"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive"
export type ButtonSize = "sm" | "md" | "lg"
export type ButtonType = "button" | "submit" | "reset"

export interface ButtonProps {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    type?: ButtonType
}

/**
 * ボタンの状態（StyleAdapterに渡す用）
 */
export interface ButtonState {
    variant: ButtonVariant
    size: ButtonSize
    disabled: boolean
    loading: boolean
    type: ButtonType
}

export interface ButtonAriaAttributes {
    "aria-disabled"?: boolean
    "aria-busy"?: boolean
    role: "button"
    type: ButtonType
}

/**
 * useButton の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface ButtonReturn {
    state: DeepReadonly<ComputedRef<ButtonState>>
    aria_attributes: DeepReadonly<ComputedRef<ButtonAriaAttributes>>
}
