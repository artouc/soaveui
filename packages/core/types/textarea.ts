import type { ComputedRef, Ref } from "vue"

export type TextareaSize = "sm" | "md" | "lg"

export interface TextareaProps {
    size?: TextareaSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    error_id?: string
    rows?: number
    resize?: "none" | "vertical" | "horizontal" | "both"
}

export interface TextareaAriaAttributes {
    "aria-invalid"?: boolean
    "aria-describedby"?: string
    "aria-readonly"?: boolean
}

export interface TextareaReturn {
    base_classes: ComputedRef<string>
    is_focused: Ref<boolean>
    has_error: ComputedRef<boolean>
    is_disabled: ComputedRef<boolean>
    is_readonly: ComputedRef<boolean>
    aria_attributes: ComputedRef<TextareaAriaAttributes>
    handleFocus: () => void
    handleBlur: () => void
}
