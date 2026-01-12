import type { ComputedRef } from "vue"

export type CheckboxSize = "sm" | "md" | "lg"

export interface CheckboxProps {
    size?: CheckboxSize
    disabled?: boolean
    indeterminate?: boolean
}

export interface CheckboxAriaAttributes {
    role: "checkbox"
    "aria-checked": boolean | "mixed"
    "aria-disabled"?: boolean
}

export interface CheckboxReturn {
    base_classes: ComputedRef<string>
    indicator_classes: ComputedRef<string>
    is_disabled: ComputedRef<boolean>
    is_indeterminate: ComputedRef<boolean>
    aria_attributes: ComputedRef<CheckboxAriaAttributes>
}
