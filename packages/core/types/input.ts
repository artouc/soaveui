import type { ComputedRef, Ref, DeepReadonly } from "vue"

export type InputSize = "sm" | "md" | "lg"
export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search"

export interface InputProps {
    type?: InputType
    size?: InputSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    error_id?: string
    id?: string
}

/**
 * 入力の状態（StyleAdapterに渡す用）
 */
export interface InputState {
    type: InputType
    size: InputSize
    disabled: boolean
    readonly: boolean
    has_error: boolean
}

export interface InputAriaAttributes {
    "aria-invalid"?: boolean
    "aria-describedby"?: string
    "aria-readonly"?: boolean
}

/**
 * useInput の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface InputReturn {
    state: DeepReadonly<ComputedRef<InputState>>
    is_focused: Ref<boolean>
    aria_attributes: DeepReadonly<ComputedRef<InputAriaAttributes>>
    handleFocus: () => void
    handleBlur: () => void
}
