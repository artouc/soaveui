import type { ComputedRef } from "vue"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
}

export interface ButtonAriaAttributes {
    "aria-disabled"?: boolean
    "aria-busy"?: boolean
    role: "button"
}

export interface ButtonReturn {
    base_classes: ComputedRef<string>
    is_disabled: ComputedRef<boolean>
    is_loading: ComputedRef<boolean>
    aria_attributes: ComputedRef<ButtonAriaAttributes>
}
