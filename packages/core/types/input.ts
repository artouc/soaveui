import type { ComputedRef, Ref } from "vue"

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
}

export interface InputAriaAttributes {
    "aria-invalid"?: boolean
    "aria-describedby"?: string
    "aria-readonly"?: boolean
}

export interface InputReturn {
    base_classes: ComputedRef<string>
    is_focused: Ref<boolean>
    has_error: ComputedRef<boolean>
    is_disabled: ComputedRef<boolean>
    is_readonly: ComputedRef<boolean>
    aria_attributes: ComputedRef<InputAriaAttributes>
    handleFocus: () => void
    handleBlur: () => void
}
