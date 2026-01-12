import type { ComputedRef, Ref, DeepReadonly } from "vue"

export type TextareaSize = "sm" | "md" | "lg"
export type TextareaResize = "none" | "vertical" | "horizontal" | "both"

export interface TextareaProps {
    size?: TextareaSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    error_id?: string
    rows?: number
    resize?: TextareaResize
}

/**
 * テキストエリアの状態（StyleAdapterに渡す用）
 */
export interface TextareaState {
    size: TextareaSize
    disabled: boolean
    readonly: boolean
    has_error: boolean
    resize: TextareaResize
}

export interface TextareaAriaAttributes {
    "aria-invalid"?: boolean
    "aria-describedby"?: string
    "aria-readonly"?: boolean
}

/**
 * useTextarea の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface TextareaReturn {
    state: DeepReadonly<ComputedRef<TextareaState>>
    is_focused: Ref<boolean>
    aria_attributes: DeepReadonly<ComputedRef<TextareaAriaAttributes>>
    handleFocus: () => void
    handleBlur: () => void
}
